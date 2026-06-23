import logging
from typing import AsyncGenerator

import httpx
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI

from .config import LLM_API_KEY, LLM_BASE_URL, LLM_MODEL, LOG_LEVEL, SSL_VERIFY

logging.basicConfig(level=LOG_LEVEL)
logger = logging.getLogger(__name__)

# Per-session conversation histories keyed by session id
_histories: dict[str, list] = {}


def get_history(session_id: str) -> list:
    if session_id not in _histories:
        _histories[session_id] = []
    return _histories[session_id]


def clear_histories() -> None:
    _histories.clear()


llm = ChatOpenAI(
    base_url=LLM_BASE_URL,
    api_key=LLM_API_KEY,
    model=LLM_MODEL,
    streaming=True,
    max_tokens=4096,
    http_async_client=httpx.AsyncClient(verify=SSL_VERIFY, timeout=httpx.Timeout(300.0)),
)

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful assistant."),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{input}"),
    ]
)

chain = prompt | llm


async def generate_response(message: str, session_id: str) -> AsyncGenerator[str, None]:
    history = get_history(session_id)
    full_response = ""
    try:
        async for chunk in chain.astream({"input": message, "history": history}):
            token = chunk.content
            if token:
                full_response += token
                yield token
    except Exception as exc:
        logger.exception("LLM streaming failed: %s", exc)
        yield "\n\n[Error: response generation was interrupted]"
    finally:
        history.append(HumanMessage(content=message))
        history.append(AIMessage(content=full_response))
