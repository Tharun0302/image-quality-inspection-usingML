import cv2
import numpy as np

def analyze_blur(image: np.ndarray) -> dict:
    """Detect blur using the variance of the Laplacian method."""
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image
        
    # Standardize image size for consistent Laplacian variance
    height, width = gray.shape
    max_dim = 600
    if max(height, width) > max_dim:
        scale = max_dim / max(height, width)
        gray = cv2.resize(gray, (int(width * scale), int(height * scale)))
        
    variance = cv2.Laplacian(gray, cv2.CV_64F).var()
    
    # 0 -> very blurry (high blur percentage)
    # The higher the variance, the sharper the image.
    if variance < 50:
        blur_percent = 100 - (variance / 50) * 10  # 90 to 100%
    elif variance < 200:
        blur_percent = 90 - ((variance - 50) / 150) * 30  # 60 to 90%
    elif variance < 500:
        blur_percent = 60 - ((variance - 200) / 300) * 40  # 20 to 60%
    else:
        blur_percent = max(0, 20 - ((variance - 500) / 1000) * 20)
        
    blur_score = int(100 - blur_percent)
    
    return {
        "blur_percentage": round(blur_percent, 1),
        "blur_score": blur_score,
        "laplacian_variance": round(variance, 2)
    }
