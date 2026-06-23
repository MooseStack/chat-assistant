# Frontend — React

A React + TypeScript chat UI built with Material UI and Vite. Communicates with the backend via streaming HTTP, rendering responses token-by-token with Markdown support.

## Tech Stack

| Category | Technologies |
|---|---|
| Language | TypeScript, JavaScript |
| UI Framework | React, Material UI (Emotion) |
| Build Tool | Vite |
| Runtime | Node.js |
| Markdown | react-markdown |
| Utilities | uuid, serve |
| Container Base | UBI (nodejs:26) |

## Features

- Streaming chat responses displayed in real time
- Markdown rendering in message bubbles
- Conversation history stored in browser local storage
- Sidebar for managing multiple chat sessions
- Responsive layout (desktop drawer / mobile overlay)

## Environment Variables

Set these in a `.env` file inside `frontend-react/app/` (copied from `.env-sample`).

| Variable       | Default                  | Description                     |
|----------------|--------------------------|---------------------------------|
| `BACKEND_URL`  | `http://localhost:8000`  | Chat backend API base URL       |
| `APP_TITLE`    | `Chat Assistant`         | Title shown in the app bar      |
| `SSL_VERIFY`   | `false`                  | Enable TLS verification (dev proxy) |

During a production build the values are replaced at startup by `prestart.cjs`, allowing runtime configuration via environment variables in the container.

## Local Development

```powershell
# Windows
.\localhost-dev.ps1
```

```bash
# Linux / macOS
./localhost-dev.sh
```

The script installs npm dependencies and starts the Vite dev server on **http://localhost:5173** with hot-reload.

## Build

```bash
cd app
npm ci
npm run build     # outputs to dist/
npm run preview   # preview the production build
```

## Container Build

Uses a multi-stage build (Node 26 on UBI):

```bash
./podman-dev.sh
```

The script builds the image, removes any existing container, and starts the frontend on **http://localhost:5173**. If a `.env` file is present it is passed to the container automatically.

## Project Structure

```
frontend-react/
├── Containerfile
├── localhost-dev.ps1 / .sh
├── podman-dev.sh
└── app/
    ├── index.html
    ├── package.json
    ├── prestart.cjs          # Pre-start env injection
    ├── vite.config.ts
    ├── tsconfig.json
    └── src/
        ├── App.tsx           # Root component
        ├── config.ts         # Runtime configuration
        ├── main.tsx          # React entry point
        ├── theme.ts          # MUI theme
        ├── components/
        │   ├── ChatInput.tsx
        │   ├── ChatView.tsx
        │   ├── MessageBubble.tsx
        │   ├── Sidebar.tsx
        │   └── WelcomeScreen.tsx
        ├── context/
        │   └── ChatContext.tsx
        ├── hooks/
        │   ├── useChat.ts
        │   └── useStreamResponse.ts
        ├── services/
        │   ├── api.ts        # Backend API client
        │   └── storage.ts    # localStorage persistence
        └── types/
            └── chat.ts
```
