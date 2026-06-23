import os
import uuid

import streamlit as st
import streamlit.components.v1 as components

_LS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_local_storage")
_ls_component = components.declare_component("local_storage", path=_LS_DIR)


def init_session_state():
    """Ensure required session-state keys exist."""
    if "session_id" not in st.session_state:
        st.session_state.session_id = str(uuid.uuid4())
    if "messages" not in st.session_state:
        st.session_state.messages = []
    if "chat_history" not in st.session_state:
        st.session_state.chat_history = {}


def reset_session():
    """Clear messages and start a new chat session."""
    st.session_state.session_id = str(uuid.uuid4())
    st.session_state.messages = []


def clear_history():
    """Clear all chat history from session state and browser storage."""
    st.session_state.chat_history = {}
    st.session_state.messages = []
    st.session_state.session_id = str(uuid.uuid4())


def save_current_chat():
    """Persist the current chat into session state history."""
    msgs = st.session_state.get("messages", [])
    sid = st.session_state.get("session_id")
    if msgs and sid:
        first_user_msg = next((m["content"] for m in msgs if m["role"] == "user"), "")
        label = (first_user_msg[:30] + "\u2026") if len(first_user_msg) > 30 else first_user_msg
        st.session_state.chat_history[sid] = {
            "label": label or "Empty chat",
            "messages": list(msgs),
        }


def sync_history():
    """Load chat_history from browser persistent storage on first run."""
    loaded = st.session_state.get("_history_loaded", False)
    if loaded:
        return

    result = _ls_component(
        storage_key="chat_history",
        save_data=None,
        key="__ls_chat_history",
        default=None,
    )

    if result is not None:
        if isinstance(result, dict) and result.get("loaded"):
            data = result.get("data")
            st.session_state.chat_history = data if isinstance(data, dict) else {}
            st.session_state._history_loaded = True
            st.rerun()


def save_history():
    """Persist chat_history to browser persistent storage."""
    if not st.session_state.get("_history_loaded", False):
        return
    _ls_component(
        storage_key="chat_history",
        save_data=st.session_state.chat_history,
        key="__ls_chat_history_save",
        default=None,
    )
