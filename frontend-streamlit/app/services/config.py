import os
from pathlib import Path

from dotenv import load_dotenv

_frontend_dir = Path(__file__).resolve().parent.parent.parent
load_dotenv(_frontend_dir / ".env")

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
APP_TITLE = os.getenv("APP_TITLE", "Chat Assistant")

SSL_VERIFY = os.getenv("SSL_VERIFY", "false").lower() in ("true", "1", "yes")
LOG_LEVEL = os.getenv("LOG_LEVEL", "ERROR").upper()
