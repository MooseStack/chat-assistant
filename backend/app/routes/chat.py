from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.services.chat import generate_response

router = APIRouter()


class ChatRequest(BaseModel):
    session_id: str = "default"
    message: str


@router.post("/chat")
async def chat(req: ChatRequest):
    return StreamingResponse(
        generate_response(req.message, req.session_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Transfer-Encoding": "chunked",
        },
    )


@router.get("/health")
async def health():
    return {"status": "ok"}
