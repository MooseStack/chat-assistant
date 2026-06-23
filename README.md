## Summary

A multi-frontend AI chat application with a **FastAPI** backend that uses **Langchain** that streams responses from a configurable LLM using an OpenAI-compatible API. Users can interact with the assistant through either a **React** or **Streamlit** frontend, as well as directly through the **Backend**

## Architecture

```
┌──────────────────┐      ┌──────────────────┐
│  React Frontend  │      │Streamlit Frontend│
│   (port 5173)    │      │   (port 8501)    │
└────────┬─────────┘      └────────┬─────────┘
         │       POST /chat        │
         └───────────┬─────────────┘
                     ▼
            ┌─────────────────────┐
            │ FastAPI/LangChain   |
            |      Backend        │
            │   (port 8000)       |
            │   /chat & /health   |
            └────────┬────────────┘
                     │ OpenAI-compatible API
                     ▼
              ┌──────────────┐
              │   LLM Model  | 
              │   /v1/chat   |
              └──────────────┘
```

## Tech Stack

| Layer | Technologies |
|---|---|
| Backend | Python, FastAPI, LangChain, LangChain-OpenAI, Uvicorn |
| React Frontend | React 18, TypeScript, Vite, Material UI 6, react-markdown |
| Streamlit Frontend | Streamlit, httpx |
| Containers | Podman / Docker, UBI 9 & UBI 10 base images |

## Features

- **Streaming responses** via Server-Sent Events (SSE)
- **Session-based conversation history** with multiple concurrent chats.
- **Browser-persisted chat history** (localStorage)
- **Two frontend options** — React (Material UI) or Streamlit
- **Containerized** with OCI-compatible Containerfiles for Kubernetes / OpenShift / Podman / Docker
- **Configurable LLM** — works with any OpenAI-compatible endpoint

## Getting Started

See [local-development.md](local-development.md) for prerequisites, local development setup, and environment variables.

Each app has its own README with detailed setup, configuration, and usage instructions:

- [Backend README](backend/README.md)
- [React Frontend README](frontend-react/README.md)
- [Streamlit Frontend README](frontend-streamlit/README.md)
- [Helm Chart README](helm/README.md)


## License

[Apache License 2.0](LICENSE)