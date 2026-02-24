from pydantic import BaseModel
from typing import List, Optional


class BatteryItem(BaseModel):
    battery_id: int
    timestamp: Optional[str] = None  # ← allow None
    status: str
    image_path: Optional[str] = None
    image_filename: Optional[str] = None


class BatteryResponse(BaseModel):
    items: List[BatteryItem]
    page: int
    page_size: int
    total: int


class MetricsResponse(BaseModel):
    total_batteries: int
    ok_count: int
    ng_count: int
