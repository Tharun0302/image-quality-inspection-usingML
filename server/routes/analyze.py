from fastapi import APIRouter, UploadFile, File, Form
import cv2
import numpy as np
import uuid
import os
from utils.noise_detector import analyze_noise
from utils.blur_detector import analyze_blur
from utils.lighting_analyzer import analyze_lighting
from utils.detail_analyzer import analyze_detail
from utils.history_manager import add_analysis

router = APIRouter()

os.makedirs("uploads", exist_ok=True)

@router.post("/analyze")
async def analyze_image_route(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if image is None:
        return {"error": "Invalid image"}
        
    image_id = str(uuid.uuid4())
    filepath = f"uploads/{image_id}.png"
    cv2.imwrite(filepath, image)
        
    noise_data = analyze_noise(image)
    blur_data = analyze_blur(image)
    lighting_data = analyze_lighting(image)
    detail_data = analyze_detail(image)
    
    final_score = (
        0.30 * detail_data["detail_score"] +
        0.25 * lighting_data["lighting_score"] +
        0.25 * blur_data["blur_score"] +
        0.20 * noise_data["noise_score"]
    )
    
    analysis_data = {
        "noise_percentage": noise_data["noise_percentage"],
        "blur_percentage": blur_data["blur_percentage"],
        "lighting_score": lighting_data["lighting_score"],
        "detail_score": detail_data["detail_score"],
        "overall_score": int(final_score),
        "metrics": {
            "noise": noise_data,
            "blur": blur_data,
            "lighting": lighting_data,
            "detail": detail_data
        }
    }
    
    # Save to history
    add_analysis(image_id, file.filename, analysis_data)
    
    response_data = analysis_data.copy()
    response_data["id"] = image_id
    response_data["url"] = f"http://localhost:8000/static/uploads/{image_id}.png"
    
    return response_data
