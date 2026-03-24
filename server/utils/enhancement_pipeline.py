import cv2
import numpy as np

def enhance_image(image: np.ndarray) -> np.ndarray:
    """
    Enhance clarity, reduce noise, preserve edges, and boost contrast.
    """
    # 1. Edge-preserving Denoising
    denoised = cv2.bilateralFilter(image, 9, 75, 75)
    
    # 2. Local Contrast Enhancement (CLAHE on L-channel)
    lab = cv2.cvtColor(denoised, cv2.COLOR_BGR2LAB)
    l_channel, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    cl = clahe.apply(l_channel)
    limg = cv2.merge((cl, a, b))
    enhanced_contrast = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
    
    # 3. Stronger Sharpening (Unsharp Masking)
    gaussian = cv2.GaussianBlur(enhanced_contrast, (0, 0), 3.0)
    sharpened = cv2.addWeighted(enhanced_contrast, 2.0, gaussian, -1.0, 0)
    
    # 4. Slightly boost saturation to make colors pop
    hsv = cv2.cvtColor(sharpened, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)
    s = cv2.multiply(s, 1.15)
    s = np.clip(s, 0, 255).astype(np.uint8)
    hsv_enhanced = cv2.merge([h, s, v])
    final_output = cv2.cvtColor(hsv_enhanced, cv2.COLOR_HSV2BGR)
    
    return final_output
