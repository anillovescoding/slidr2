from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from routes import health, keys, generate

app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
)

# CORS configuration to accept requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(keys.router)
app.include_router(generate.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Slidr 2.0 API"}
