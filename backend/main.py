"""Vercel service entrypoint.

Vercel's Python runtime looks for a top-level `app` in a supported entry file.
We re-export the FastAPI instance defined in `app/main.py`.
"""

from app.main import app
