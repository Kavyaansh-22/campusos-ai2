"""
Central configuration for the CampusOS AI Assistant backend.

Everything here is read from environment variables (via a .env file in
development). Nothing here should ever contain a real credential.
"""
import os
from urllib.parse import quote_plus
from dotenv import load_dotenv

# Load variables from a .env file if present (does nothing in prod if the
# platform injects real environment variables instead).
load_dotenv()


class Settings:
    # --- Database ---
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: int = int(os.getenv("DB_PORT", "3306"))
    DB_NAME: str = os.getenv("DB_NAME", "campusos")
    DB_USER: str = os.getenv("DB_USER", "root")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "")

    # --- AI provider ---
    # "anthropic" and "gemini" are both implemented (see services/ai_service.py).
    # The rest of the app only talks to the AIService abstraction, so adding
    # a third provider later doesn't touch anything outside that one file.
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gemini")
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    AI_MODEL: str = os.getenv("AI_MODEL", "gemini-3.6-flash")

    # --- App ---
    APP_ENV: str = os.getenv("APP_ENV", "development")
    CORS_ORIGINS: list[str] = os.getenv("CORS_ORIGINS", "*").split(",")

    @property
    def database_url(self) -> str:
        """SQLAlchemy connection string for MySQL via PyMySQL.

        Credentials are URL-encoded — MySQL passwords are very often
        allowed to contain characters like '@', ':', or '/' that have
        special meaning inside a connection URL. Without encoding, a
        password like "MySQLLab@2026" gets misread as a host separator
        and the connection fails with a confusing DNS-lookup error.
        """
        user = quote_plus(self.DB_USER)
        password = quote_plus(self.DB_PASSWORD)
        return (
            f"mysql+pymysql://{user}:{password}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )


settings = Settings()