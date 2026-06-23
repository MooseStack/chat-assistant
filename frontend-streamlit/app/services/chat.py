import logging
import time

import httpx
import streamlit as st

from .config import BACKEND_URL, LOG_LEVEL, SSL_VERIFY

logging.basicConfig(level=LOG_LEVEL)
logger = logging.getLogger(__name__)

# Minimum seconds between placeholder renders to prevent browser stalls.
_RENDER_INTERVAL = 0.05


def _save_partial(content: str) -> None:
    """Persist the in-progress response into session state so it survives reruns."""
    msgs = st.session_state.get("messages")
    if msgs and msgs[-1]["role"] == "assistant":
        msgs[-1]["content"] = content


def stream_response(session_id: str, message: str) -> str:
    """Send a message to the backend and stream the response text."""
    full_response = ""
    placeholder = st.empty()
    last_render = 0.0

    try:
        with httpx.Client(
            timeout=httpx.Timeout(connect=10.0, read=300.0, write=10.0, pool=10.0),
            verify=SSL_VERIFY,
        ) as client:
            with client.stream(
                "POST",
                f"{BACKEND_URL}/chat",
                json={"session_id": session_id, "message": message},
            ) as response:
                response.raise_for_status()
                for chunk in response.iter_text():
                    full_response += chunk
                    now = time.monotonic()
                    if now - last_render >= _RENDER_INTERVAL:
                        _save_partial(full_response)
                        placeholder.markdown(full_response + "▌")
                        last_render = now
    except httpx.HTTPStatusError as exc:
        if exc.response.status_code == 504:
            error_msg = "⚠️ *The server took too long to respond (504 Gateway Timeout). Please try again.*"
            if full_response:
                _save_partial(full_response)
                placeholder.markdown(full_response + "\n\n" + error_msg)
                return full_response
            placeholder.markdown(error_msg)
            _save_partial(error_msg)
            return error_msg
        raise
    except (httpx.RemoteProtocolError, httpx.ReadTimeout):
        if full_response:
            _save_partial(full_response)
            placeholder.markdown(full_response + "\n\n⚠️ *Connection interrupted — partial response shown.*")
            return full_response
        raise

    _save_partial(full_response)
    placeholder.markdown(full_response)
    return full_response
