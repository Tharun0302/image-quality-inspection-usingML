import cv2
import numpy as np

def analyze_detail(image: np.ndarray) -> dict:
    """Detail measurement analyzing high-frequency info via Sobel edges."""
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image
        
    sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
    sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
    
    magnitude = cv2.magnitude(sobelx, sobely)
    mean_magnitude = np.mean(magnitude)
    
    detail_score = min(100, (mean_magnitude / 50.0) * 100)
    
    edge_density = "Low"
    if detail_score > 75:
        edge_density = "High"
    elif detail_score > 40:
        edge_density = "Medium"
        
    return {
        "detail_score": int(detail_score),
        "edge_density": edge_density
    }
