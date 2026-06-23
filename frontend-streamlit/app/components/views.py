import streamlit as st

from app.services import stream_response
from app.services.config import APP_TITLE


def render_chat():
    """Render the chat history, welcome screen, and handle new input."""
    if not st.session_state.messages:
        st.title(f"✦ How can I help you today?")
        st.caption("Send a message to start a conversation.")

    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

    if user_input := st.chat_input("Message…"):
        st.session_state.messages.append({"role": "user", "content": user_input})
        with st.chat_message("user"):
            st.markdown(user_input)

        # Add assistant message to session state *before* streaming so
        # partial content survives if Streamlit reruns mid-stream.
        assistant_msg = {"role": "assistant", "content": ""}
        st.session_state.messages.append(assistant_msg)

        with st.chat_message("assistant"):
            full_response = stream_response(
                st.session_state.session_id, user_input
            )

        assistant_msg["content"] = full_response
