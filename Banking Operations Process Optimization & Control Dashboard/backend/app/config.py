from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


ROOT_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE = ROOT_DIR / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE) if ENV_FILE.exists() else None,
        extra="ignore",
    )

    database_url: str = ""
    cors_origins: str = "http://localhost:5173,http://localhost:5175"

    @property
    def sqlite_path(self) -> Path:
        db_dir = ROOT_DIR / "database"
        db_dir.mkdir(parents=True, exist_ok=True)
        return db_dir / "banking_ops.db"

    @property
    def sqlalchemy_url(self) -> str:
        return f"sqlite:///{self.sqlite_path.as_posix()}"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
