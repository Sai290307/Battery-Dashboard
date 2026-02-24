import os
import re
from pathlib import Path
from typing import List, Dict

# ----------------------------------
# PATH CONFIGURATION
# ----------------------------------

DATA_DIR = Path("data")
CSV_FILE = DATA_DIR / "resin_csv_2026-02-18.csv"
RESULT_FILE = DATA_DIR / "results_2026-02-18.txt"

# Global storage
batteries: List[Dict] = []


# ----------------------------------
# RESULT.TXT PARSER
# ----------------------------------

def parse_result_file():
    """
    Parse result.txt and return dict:
    {
        "2026-02-18 06:03:17": "OK"
    }
    """
    results = {}

    if not RESULT_FILE.exists():
        print(f"[WARN] result.txt not found: {RESULT_FILE}")
        return results

    try:
        with open(RESULT_FILE, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    parts = line.strip().split("|")
                    timestamp = parts[0].strip()

                    result_part = [p for p in parts if "RESULT:" in p][0]
                    result_value = result_part.split(":")[1].strip()

                    status = "OK" if result_value == "GO" else "NG"

                    results[timestamp] = status
                except Exception:
                    continue
    except Exception as e:
        print(f"[ERROR] Failed to parse result.txt: {e}")

    return results


# ----------------------------------
# TIMESTAMP EXTRACTOR
# ----------------------------------

def extract_timestamp_from_filename(filename: str):
    """
    image_20260218_060317.jpg
    → 2026-02-18 06:03:17
    """
    try:
        match = re.search(r"image_(\d{8})_(\d{6})", filename)
        if not match:
            return None

        date_part = match.group(1)
        time_part = match.group(2)

        return (
            f"{date_part[0:4]}-{date_part[4:6]}-{date_part[6:8]} "
            f"{time_part[0:2]}:{time_part[2:4]}:{time_part[4:6]}"
        )
    except Exception:
        return None


# ----------------------------------
# MAIN PARSER (UPDATED)
# ----------------------------------

def parse_log_and_csv():
    global batteries
    batteries.clear()

    if not CSV_FILE.exists():
        print(f"[ERROR] CSV file not found: {CSV_FILE}")
        return

    print(f"[INFO] Starting parse from CSV: {CSV_FILE.absolute()}")

    # Load result.txt data first
    result_data = parse_result_file()

    try:
        with open(CSV_FILE, 'r', encoding='utf-8') as file:
            lines = file.readlines()
            if not lines:
                return
            
            # Skip the header line (Date Hour ImagePath PassCount NotPassCount)
            for i, line in enumerate(lines[1:]):
                line = line.strip()
                if not line:
                    continue
                
                # Split columns dynamically by 1 or more spaces
                parts = re.split(r'\s+', line)
                if len(parts) < 5:
                    continue
                
                try:
                    date_val = parts[0]
                    hour_val = parts[1]
                    image_path = parts[2]
                    pass_count = int(parts[3])
                    not_pass_count = int(parts[4])
                    
                    filename = os.path.basename(image_path) if image_path else ''
                    
                    # Extract full timestamp from filename
                    timestamp = extract_timestamp_from_filename(filename)

                    # Default status from CSV
                    csv_status = "OK" if not_pass_count == 0 else "NG"

                    # Override status if result.txt has data for this exact timestamp
                    final_status = result_data.get(timestamp, csv_status)

                    battery_entry = {
                        "id": i + 1,
                        "date": date_val,
                        "hour": hour_val,
                        "timestamp": timestamp,
                        "image_path": image_path,
                        "image_filename": filename,
                        "pass_count": pass_count,
                        "not_pass_count": not_pass_count,
                        "status": final_status
                    }

                    batteries.append(battery_entry)

                except Exception as e:
                    print(f"[WARN] Error parsing row {i}: {e}")
                    continue

    except Exception as e:
        print(f"[ERROR] Failed to read CSV file: {e}")
        return

    print(f"[INFO] Parsed {len(batteries)} battery records")