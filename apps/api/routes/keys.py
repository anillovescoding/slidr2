from fastapi import APIRouter, Header, HTTPException, Depends
from pydantic import BaseModel
from services.db_service import DBService
from services.crypto_service import CryptoService

router = APIRouter(prefix="/keys", tags=["keys"])

class ApiKeyCreate(BaseModel):
    provider: str
    key: str

class ApiKeyResponse(BaseModel):
    id: str
    provider: str

def get_auth_token(authorization: str = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    return authorization.split(" ")[1]

@router.post("", response_model=ApiKeyResponse)
async def create_key(payload: ApiKeyCreate, token: str = Depends(get_auth_token)):
    pb = DBService.get_user_client(token)
    if not pb.auth_store.is_valid:
        raise HTTPException(status_code=401, detail="Invalid PocketBase token")
        
    user_id = pb.auth_store.model.id
    encrypted = CryptoService.encrypt(payload.key)
    
    try:
        record = pb.collection("api_keys").create({
            "user_id": user_id,
            "provider": payload.provider,
            "encrypted_key": encrypted
        })
        return ApiKeyResponse(id=record.id, provider=record.provider)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("", response_model=list[ApiKeyResponse])
async def list_keys(token: str = Depends(get_auth_token)):
    pb = DBService.get_user_client(token)
    if not pb.auth_store.is_valid:
        raise HTTPException(status_code=401, detail="Invalid PocketBase token")

    try:
        # PB auth rules naturally filter to the user's records
        records = pb.collection("api_keys").get_full_list()
        return [ApiKeyResponse(id=r.id, provider=r.provider) for r in records]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
