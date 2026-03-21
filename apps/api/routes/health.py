from fastapi import APIRouter
from pydantic import BaseModel

class HealthCheckResponse(BaseModel):
    status: str
    version: str

router = APIRouter(prefix="/health", tags=["health"])

@router.get("", response_model=HealthCheckResponse)
async def health_check():
    return HealthCheckResponse(status="ok", version="1.0.0")
