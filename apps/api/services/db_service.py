import pocketbase
from core.config import settings
from typing import Optional

class DBService:
    @staticmethod
    def get_client() -> pocketbase.PocketBase:
        """Returns a generic unauthenticated PocketBase client."""
        return pocketbase.PocketBase(settings.pocketbase_url)

    @staticmethod
    def get_user_client(token: str) -> pocketbase.PocketBase:
        """Returns a PocketBase client authenticated as the incoming user.
        The token must be retrieved from the Authorization header of the incoming request.
        """
        pb = pocketbase.PocketBase(settings.pocketbase_url)
        # Authenticate using the token string
        pb.auth_store.save(token, None)
        return pb
