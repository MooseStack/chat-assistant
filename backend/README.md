# Backend — Chat API

A FastAPI application that exposes a streaming chat endpoint powered by LangChain and an OpenAI-compatible LLM.

## Tech Stack

| Category | Technologies |
|---|---|
| Language | Python |
| Framework | FastAPI, Uvicorn |
| AI / LLM | LangChain, LangChain-OpenAI |
| Data Validation | Pydantic |
| Configuration | python-dotenv |
| Container Base | UBI 9 (ubi9/python-314) |

## Endpoints

| Method | Path      | Description                                      |
|--------|-----------|--------------------------------------------------|
| POST   | `/chat`   | Send a message and receive a streaming SSE response |
| GET    | `/health` | Health check                                     |
| GET    | `/`       | Swagger UI (auto-generated docs)                 |

### POST `/chat`

**Request body:**

```json
{
  "session_id": "optional-session-id",
  "message": "Hello!"
}
```

The response is a `text/event-stream` of tokens streamed as they are generated. Conversation history is maintained per `session_id` in memory.

## Environment Variables

| Variable               | Default                   | Description                              |
|------------------------|---------------------------|------------------------------------------|
| `LLM_BASE_URL`        | `http://localhost:8080/v1` | OpenAI-compatible API base URL           |
| `LLM_API_KEY`         | `not-needed`              | API key for the LLM service             |
| `LLM_MODEL`           | `local-model`             | Model name to use                        |
| `SSL_VERIFY`          | `false`                   | Enable TLS certificate verification      |
| `LOG_LEVEL`           | `ERROR`                   | Python logging level                     |
| `CORS_ALLOWED_ORIGINS`| *(empty)*                 | Comma-separated list of allowed origins  |

Create a `.env` file in the `backend/` directory (copied from `.env-sample`) to set these values.

## Local Development

```powershell
# Windows
.\localhost-dev.ps1
```

```bash
# Linux / macOS
./localhost-dev.sh
```

The script creates a virtual environment, installs dependencies, and starts the server on **http://localhost:8000** with hot-reload.

## Container Build

```bash
./podman-dev.sh
```

The script builds the image, removes any existing container, and starts the backend on **http://localhost:8000**. If a `.env` file is present it is passed to the container automatically.

## Project Structure

```
backend/
├── Containerfile
├── localhost-dev.ps1 / .sh
├── podman-dev.sh
├── test_stream.py            # Streaming endpoint test
└── app/
    ├── main.py               # App entrypoint & lifespan
    ├── requirements.txt
    ├── routes/
    │   └── chat.py           # POST /chat and GET /health endpoints
    └── services/
        ├── chat.py           # LLM streaming via LangChain
        └── config.py         # Environment-based configuration
```