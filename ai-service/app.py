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
    core = cv2.morphologyEx(((dc > 95) & (chroma <= 60)).astype(np.uint8) * 255, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))

    strong = ((mn >= 205) & ((mx - mn) <= 35)).astype(np.uint8) * 255
    strong = cv2.morphologyEx(strong, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    strong = cv2.morphologyEx(strong, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    n, labels, stats, _ = cv2.connectedComponentsWithStats(strong, connectivity=8)
    keep = [i for i in range(1, n) if stats[i, cv2.CC_STAT_AREA] >= max(60, int(0.0004 * h * w))]
    strong = np.isin(labels, keep).astype(np.uint8) * 255

    weak = ((mn >= 150) & ((mx - mn) <= 60)).astype(np.uint8) * 255
    near = cv2.dilate(core, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (patch + 14, patch + 14)))
    m = cv2.bitwise_or(cv2.bitwise_or(core, strong), cv2.bitwise_and(weak, near))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    k = max(7, int(round(min(h, w) * 0.015))) | 1                          # widen to cover soft cloud edges
    m = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
    m[bgr.max(axis=2) < 10] = 0                                            # keep the black no-data border untouched
    return m


def dehaze_thin(bgr: np.ndarray, mask: np.ndarray):
    """Thin, see-through cloud: remove the veil and keep the ground that shows through.
    Returns (image, thick_mask). thick_mask = areas with no usable ground, still to be reconstructed."""
    if mask.max() == 0:
        return bgr.copy(), mask
    f = bgr.astype(np.float32)
    dc, patch = dark_channel(bgr)
    k = np.ones((patch, patch), np.uint8)
    A = np.maximum(f[dc >= np.percentile(dc, 99.5)].mean(axis=0), 1)        # colour of the cloud / haze
    dcn = cv2.GaussianBlur(cv2.erode((f / A).min(axis=2), k), (0, 0), patch / 3)
    t = np.clip(1 - 0.75 * dcn, 0.45, 1)                                    # transmission, gentle
    J = np.clip((f - A) / t[..., None] + A, 0, 255)
    inside = mask > 0
    thick = ((dcn > 0.8) | (f.min(axis=2) >= 185)) & inside              # opaque white = no ground visible
    thin = inside & (~thick)
    ring = (cv2.dilate(mask, np.ones((71, 71), np.uint8)) > 0) & (~inside)
    if ring.sum() > 500 and thin.sum() > 0:                                 # repaired area gets the surroundings' colour statistics
        for c in range(3):

# TODO: Implement rest of the logic (WIP Week 3)
