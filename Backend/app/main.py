from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .parsing import parse_log_and_csv, batteries
from .schemas import MetricsResponse, BatteryResponse, BatteryItem
import os
from typing import Optional

app = FastAPI(title="Battery Inspection API")

IMAGE_DIR = "static_images"

if not os.path.exists(IMAGE_DIR):
    os.makedirs(IMAGE_DIR)

app.mount("/images", StaticFiles(directory=IMAGE_DIR), name="images")

# Allow CORS for local dev
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    parse_log_and_csv()

@app.get("/api/metrics", response_model=MetricsResponse)
def get_metrics():
    ok_count = sum(1 for b in batteries if b["status"] == "OK")
    ng_count = sum(1 for b in batteries if b["status"] == "NG")
    total = ok_count + ng_count
    return {
        "total_batteries": total,
        "ok_count": ok_count,
        "ng_count": ng_count,
    }

@app.get("/api/batteries", response_model=BatteryResponse)
def get_batteries(
    request: Request,
    status: str = Query(..., regex="^(OK|NG)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, le=100),
    search: Optional[str] = Query(None)
):
    filtered = [b for b in batteries if b["status"] == status]

    if search and search.strip():
        search_term = search.strip().lower()
        filtered = [
            b for b in filtered 
            if (
                str(b.get("battery_id", "")).find(search_term) != -1 or
                (b.get("timestamp") and b["timestamp"].lower().find(search_term) != -1) or
                (b.get("date") and b["date"].find(search_term) != -1) or
                (b.get("hour") and b["hour"].find(search_term) != -1) or
                (b.get("image_filename") and b["image_filename"].lower().find(search_term) != -1)
            )
        ]

    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paginated_items = filtered[start_idx:end_idx]
    
    battery_items = []
    
    base_url = str(request.base_url).rstrip("/")

    for i, item in enumerate(paginated_items):
        
        image_filename = item.get('image_filename')
        date_val = item.get('date')
        hour_val = item.get('hour')
        
        full_image_url = None
        
        if image_filename and date_val and hour_val:
            # Construct the URL path
            full_image_url = f"{base_url}/images/{date_val}/{hour_val}/{image_filename}"

        battery_item = BatteryItem(
            battery_id=item.get("id", start_idx + i + 1),
            timestamp=item.get("timestamp") or "",
            status=item['status'],
            image_path=full_image_url if full_image_url else "", 
            image_filename=image_filename
        )
        battery_items.append(battery_item)

    return {
        "items": battery_items,
        "page": page,
        "page_size": page_size,
        "total": len(filtered)
    }

@app.get("/api/batteries/search")
def search_batteries(
    q: str = Query(..., min_length=1, description="Search query"),
    status: Optional[str] = Query(None, regex="^(OK|NG)$"),
    limit: int = Query(20, le=100)
):
    """Dedicated search endpoint with more flexible searching"""
    search_term = q.strip().lower()
    results = []
    
    for b in batteries:
        if status and b["status"] != status:
            continue

        match = (
            str(b.get("id", "")).find(search_term) != -1 or
            (b.get("timestamp") and b["timestamp"].lower().find(search_term) != -1) or
            (b.get("date") and b["date"].find(search_term) != -1) or
            (b.get("hour") and b["hour"].find(search_term) != -1) or
            (b.get("image_filename") and b["image_filename"].lower().find(search_term) != -1)
        )
        
        if match:
            results.append({
                "battery_id": b.get("id"),
                "timestamp": b.get("timestamp"),
                "date": b.get("date"),
                "hour": b.get("hour"),
                "status": b.get("status"),
                "image_filename": b.get("image_filename")
            })
            
            if len(results) >= limit:
                break
    
    return {
        "query": q,
        "total": len(results),
        "results": results[:limit]
    }

@app.get("/api/batteries/suggestions")
def get_search_suggestions(
    q: str = Query(..., min_length=1, description="Search query for suggestions"),
    limit: int = Query(10, le=20)
):
    """Get search suggestions based on partial input"""
    search_term = q.strip().lower()
    suggestions = set()
    
    for b in batteries:

        battery_id = str(b.get("id", ""))
        if battery_id.startswith(search_term) or search_term in battery_id:
            suggestions.add(f"ID: {battery_id}")
        

        if b.get("timestamp"):
            timestamp = b["timestamp"].lower()
            if search_term in timestamp:

                date_part = timestamp.split()[0] if ' ' in timestamp else timestamp
                if search_term in date_part:
                    suggestions.add(f"Date: {date_part}")

        if len(suggestions) >= limit:
            break
    
    return {
        "query": q,
        "suggestions": list(suggestions)[:limit]
    }

@app.get("/api/test-image")
def test_image():
    """Test endpoint to verify image serving"""
    result = {
        "total_batteries": len(batteries),
        "ok_count": sum(1 for b in batteries if b["status"] == "OK"),
        "ng_count": sum(1 for b in batteries if b["status"] == "NG"),
    }
    
    batteries_with_images = [b for b in batteries if b["image_path"]]
    batteries_without_images = [b for b in batteries if not b["image_path"]]
    
    result["with_images"] = len(batteries_with_images)
    result["without_images"] = len(batteries_without_images)
    
    if batteries_with_images:
        result["sample_battery_with_image"] = batteries_with_images[0]
    
    if batteries_without_images:
        result["sample_battery_without_image"] = batteries_without_images[0]
    
    result["search_example"] = "Try: /api/batteries?status=OK&search=2026 or /api/batteries/search?q=123"
    
    return result

@app.get("/api/debug/fields")
def debug_fields():
    """Debug endpoint to see what fields are available for searching"""
    if not batteries:
        return {"error": "No batteries loaded"}
    
    sample = batteries[0]
    return {
        "available_fields": list(sample.keys()),
        "sample_data": sample,
        "searchable_fields": ["id", "timestamp", "date", "hour", "image_filename", "status"],
        "total_records": len(batteries)
    }