import json
import os
from datetime import datetime

HISTORY_FILE = "history.json"

def get_history():
    if not os.path.exists(HISTORY_FILE):
        return []
    with open(HISTORY_FILE, "r") as f:
        return json.load(f)

def save_history(history):
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=4)

def add_analysis(image_id, filename, analysis_data):
    history = get_history()
    # Check if already exists (shouldn't if UUIDs are used, but safe)
    record = next((item for item in history if item["id"] == image_id), None)
    
    if record:
        record.update(analysis_data)
    else:
        new_record = {
            "id": image_id,
            "filename": filename,
            "timestamp": datetime.now().isoformat(),
            "analysis": analysis_data,
            "enhanced": False
        }
        history.insert(0, new_record)  # Prepends to start
        
    save_history(history)
    return new_record

def mark_enhanced(image_id):
    history = get_history()
    record = next((item for item in history if item["id"] == image_id), None)
    if record:
        record["enhanced"] = True
        save_history(history)
        return record
    return None
