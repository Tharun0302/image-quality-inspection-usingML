import cv2
import numpy as np

def analyze_lighting(image: np.ndarray) -> dict:
    """Lighting quality analysis using mean intensity."""
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image
        
    mean_intensity = np.mean(gray)
    diff_from_ideal = abs(mean_intensity - 127.5)
    
    lighting_score = max(0, 100 - (diff_from_ideal / 127.5) * 100)
    
    return {
        "lighting_score": int(lighting_score),
        "mean_intensity": round(mean_intensity, 2),
        "lighting_percentage": int(lighting_score)
    }
