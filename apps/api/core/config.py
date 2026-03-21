from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    api_title: str = "Slidr 2.0 API"
    api_version: str = "1.0.0"
    api_port: int = 8000
    pocketbase_url: str = "http://127.0.0.1:8090"
    encryption_key: str = "MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI=" # Fernet requires 32 url-safe base64 bytes
    
    # Allows loading from actual environment variables or a .env file
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
