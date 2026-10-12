"""CloudRecon AI service.

POST /process?composite=false-color|natural   (body: PNG bytes)
  -> JSON { output_png_b64, mask_png_b64, coverage, cloudRemoval, confidence, score, engine, report }

Reconstruction uses LaMa (a generative inpainting network) when `simple-lama-inpainting` is installed,
otherwise OpenCV Navier-Stokes inpainting. The cloud-free image is blended back into the original
only inside the cloud mask, so clear pixels are never changed.
"""
import base64
import io
import os
from datetime import datetime

import cv2
import numpy as np
from fastapi import FastAPI, File, Form, UploadFile
from PIL import Image

app = FastAPI(title="CloudRecon AI service")
MAX_SIDE = int(os.getenv("MAX_SIDE", "1024"))   # LaMa runs at most this many pixels on the long side

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-image")
_gemini = _gtypes = None
if os.getenv("GEMINI_API_KEY"):
    try:
        from google import genai
        from google.genai import types as _gtypes
        _gemini = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
        print("Gemini enabled:", GEMINI_MODEL)
    except Exception as e:
        print("Gemini not available:", e)

_lama = None
ENGINE = "opencv-inpaint"
try:
    from simple_lama_inpainting import SimpleLama
    _lama = SimpleLama()
    ENGINE = "generative-ai"
    print("LaMa generative model loaded")
except Exception as e:  # missing package, no weights, no internet...
    print("LaMa not available, using OpenCV fallback:", e)


# ---------------------------------------------------------------- cloud detection
def detect(bgr: np.ndarray) -> np.ndarray:
    """Bright, low-colour pixels. Returns a boolean array."""
    b, g, r = (bgr[:, :, i].astype(np.int16) for i in range(3))
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
    return (mn >= 150) & ((mx - mn) <= 60)


def dark_channel(bgr: np.ndarray):
    """Smoothed dark channel: high only where something veils the ground (cloud, haze). Rooftops stay low."""
    f = bgr.astype(np.float32)
    h, w = bgr.shape[:2]
    patch = max(15, int(min(h, w) * 0.06)) | 1
    dc = cv2.GaussianBlur(cv2.erode(f.min(axis=2), np.ones((patch, patch), np.uint8)), (0, 0), patch / 3)
    return dc, patch


def veil_level(img: np.ndarray, mask: np.ndarray) -> float:
    dc, _ = dark_channel(img)
    return float(dc[mask > 0].mean()) if (mask > 0).any() else 0.0


def cloud_mask(bgr: np.ndarray) -> np.ndarray:
    """Clouds = veiled areas (dark channel) + very white blobs + bright pixels next to those.
    Bright rooftops and roads, which are small and sit on a dark ground, are not clouds."""
    h, w = bgr.shape[:2]
    b, g, r = (bgr[:, :, i].astype(np.int16) for i in range(3))
    mx, mn = np.maximum(np.maximum(r, g), b), np.minimum(np.minimum(r, g), b)
    dc, patch = dark_channel(bgr)
    chroma = cv2.GaussianBlur((mx - mn).astype(np.float32), (0, 0), patch / 3)       # cloud is colourless, sand and soil are not

# TODO: Implement rest of the logic (WIP Week 2)
