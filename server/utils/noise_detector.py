import cv2
import numpy as np

def analyze_noise(image: np.ndarray) -> dict:
    """Detect noise using standard deviation of pixel intensity diffs from median blur."""
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image

    median = cv2.medianBlur(gray, 3)
    diff = cv2.absdiff(gray, median)
    noise_level = np.std(diff)
    
    noise_percentage = min(100.0, (noise_level / 20.0) * 100.0)
    noise_score = max(0.0, 100.0 - noise_percentage)
    
    return {
        "noise_percentage": round(noise_percentage, 1),
        "noise_score": int(noise_score)
    }
