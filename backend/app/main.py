from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import router
from app.services.chat import clear_histories
from app.services.config import CORS_ALLOWED_ORIGINS


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    clear_histories()


app = FastAPI(title="Chat Backend", docs_url="/", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
