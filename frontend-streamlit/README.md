# Frontend — Streamlit

A Streamlit chat interface that streams responses from the backend API. Provides a simple, Python-only alternative to the React frontend.

## Tech Stack

| Category | Technologies |
|---|---|
| Language | Python |
| Framework | Streamlit |
| HTTP Client | httpx |
| Configuration | python-dotenv |
| Container Base | UBI 9 (ubi9/python-314) |

## Features

- Streaming chat responses via the backend `/chat` endpoint
- Conversation history persisted in browser local storage
- Sidebar for managing multiple chat sessions
- Configurable app title and backend URL

## Environment Variables

Set these in a `.env` file in the `frontend-streamlit/` directory (copied from `.env-sample`).

| Variable       | Default                 | Description                     |
|----------------|-------------------------|---------------------------------|
| `BACKEND_URL`  | `http://localhost:8000` | Chat backend API base URL       |
| `APP_TITLE`    | `Chat Assistant`        | Title shown in the browser tab  |
| `SSL_VERIFY`   | `false`                 | Enable TLS certificate verification |
| `LOG_LEVEL`    | `ERROR`                 | Python logging level            |

## Local Development

```powershell
# Windows
.\localhost-dev.ps1
```

```bash
# Linux / macOS
./localhost-dev.sh
```

The script creates a virtual environment, installs dependencies, and starts Streamlit on **http://localhost:8501**.

## Container Build

```bash
./podman-dev.sh
```

The script builds the image, removes any existing container, and starts the Streamlit frontend on **http://localhost:8501**. If a `.env` file is present it is passed to the container automatically.

## Project Structure

```
frontend-streamlit/
├── Containerfile
├── localhost-dev.ps1 / .sh
├── podman-dev.sh
└── app/
    ├── main.py               # Streamlit entry point
    ├── requirements.txt
    ├── components/
    │   ├── sidebar.py
    │   └── views.py
    └── services/
        ├── chat.py           # Backend API client
        ├── config.py
        ├── session.py        # Session state management
        └── _local_storage/
            └── index.html    # localStorage bridge
```