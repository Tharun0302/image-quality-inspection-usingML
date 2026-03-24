from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
import cv2
import numpy as np
import os
from utils.enhancement_pipeline import enhance_image
from utils.history_manager import mark_enhanced

router = APIRouter()

os.makedirs("enhanced", exist_ok=True)

@router.post("/enhance")
async def enhance_image_route(
    file: UploadFile = File(...),
    image_id: str = Form(None)
):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if image is None:
        return {"error": "Invalid image"}
        
    enhanced = enhance_image(image)
    
    # Save the enhanced image globally rather than just returning it
    filename = file.filename
    if image_id:
        # Use the ID provided from analyze to map it
        file_id = image_id
        mark_enhanced(image_id)
    else:
        # Fallback if no ID given
        import uuid
        file_id = str(uuid.uuid4())
        
    filepath = f"enhanced/{file_id}.png"
    cv2.imwrite(filepath, enhanced)
    
    url = f"http://localhost:8000/static/enhanced/{file_id}.png"
    
    return JSONResponse(status_code=200, content={"enhanced_url": url, "id": file_id})
