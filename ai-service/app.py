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

# TODO: Implement rest of the logic (WIP Week 1)
