from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from services.db_service import DBService
from services.ai_service import AiService, GeneratedSlide
from routes.keys import get_auth_token

router = APIRouter(prefix="/generate", tags=["generate"])


class GenerateRequest(BaseModel):
    topic: str = Field(..., min_length=3, max_length=300)
    num_slides: int = Field(default=5, ge=3, le=15)
    provider: str = Field(default="OpenAI")


class GenerateResponse(BaseModel):
    slides: list[GeneratedSlide]


@router.post("/carousel", response_model=GenerateResponse)
async def generate_carousel(
    payload: GenerateRequest,
    token: str = Depends(get_auth_token),
) -> GenerateResponse:
    pb = DBService.get_user_client(token)
    if not pb.auth_store.is_valid:
        raise HTTPException(status_code=401, detail="Invalid token")

    # Fetch the user's API key for the requested provider
    try:
        records = pb.collection("api_keys").get_full_list(
            query_params={"filter": f'provider = "{payload.provider}"'}
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch API keys: {e}")

    if not records:
        raise HTTPException(
            status_code=422,
            detail=f"No API key found for provider '{payload.provider}'. Add one in Settings.",
        )

    encrypted_key: str = records[0].encrypted_key

    try:
        slides = AiService.generate(
            encrypted_key=encrypted_key,
            provider=payload.provider,
            topic=payload.topic,
            num_slides=payload.num_slides,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI generation failed: {e}")

    return GenerateResponse(slides=slides)
