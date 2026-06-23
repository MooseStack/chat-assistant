# Getting Started (Local Development)

## Prerequisites

- **Python 3.10+**
- **Node.js 26+** (for the React frontend)
- An **OpenAI-compatible LLM endpoint** (local or remote)

## Run All Services

Launch the backend and both frontends with a single command from the repo root:

**PowerShell:**
```powershell
./localhost-dev.ps1
```

**Bash:**
```bash
chmod +x localhost-dev.sh
./localhost-dev.sh
```

This starts all three services in parallel:
- **Backend** → http://localhost:8000
- **React Frontend** → http://localhost:5173
- **Streamlit Frontend** → http://localhost:8501

Press `Ctrl+C` to stop everything.

---

## Run Services Individually

For full details on each app (endpoints, configuration, container builds, etc.), see the individual READMEs:

- [Backend README](backend/README.md)
- [React Frontend README](frontend-react/README.md)
- [Streamlit Frontend README](frontend-streamlit/README.md)