import streamlit as st

from app.services import clear_history, reset_session


def render_sidebar():
    """Render the sidebar with chat history controls."""
    with st.sidebar:
        if st.button("＋  New Chat", use_container_width=True):
            reset_session()
            st.rerun()

        st.divider()
        st.markdown("#### Chat History")

        history = st.session_state.get("chat_history", {})
        if not history:
            st.caption("No previous chats yet.")
        else:
            for sid, chat in reversed(list(history.items())):
                label = chat["label"]
                if st.button(label, key=f"hist_{sid}", use_container_width=True):
                    _load_chat(sid)
                    st.rerun()

            st.divider()
            if st.button("🗑️  Clear Chat History", use_container_width=True):
                clear_history()
                st.rerun()


def _load_chat(session_id: str):
    """Restore a previous chat session."""
    chat = st.session_state.chat_history[session_id]
    st.session_state.session_id = session_id
    st.session_state.messages = list(chat["messages"])
