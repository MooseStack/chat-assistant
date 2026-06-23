"""Streamlit entrypoint — wires together page config, styles, and layout."""

import os
import sys

# Ensure the directory containing the 'app' package is on sys.path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env"))

import streamlit as st

from app.components import render_chat, render_sidebar
from app.services import init_session_state, save_current_chat, save_history, sync_history

st.set_page_config(
    page_title=os.getenv("APP_TITLE", "Chat Assistant"),
    page_icon="✦",
    layout="wide",
    initial_sidebar_state="expanded",
)

init_session_state()
sync_history()
render_sidebar()
render_chat()
save_current_chat()
save_history()
