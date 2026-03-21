from cryptography.fernet import Fernet
from core.config import settings

class CryptoService:
    @staticmethod
    def get_cipher() -> Fernet:
        return Fernet(settings.encryption_key.encode('utf-8'))

    @staticmethod
    def encrypt(data: str) -> str:
        if not data:
            return ""
        cipher = CryptoService.get_cipher()
        return cipher.encrypt(data.encode('utf-8')).decode('utf-8')

    @staticmethod
    def decrypt(encrypted_data: str) -> str:
        if not encrypted_data:
            return ""
        cipher = CryptoService.get_cipher()
        return cipher.decrypt(encrypted_data.encode('utf-8')).decode('utf-8')
