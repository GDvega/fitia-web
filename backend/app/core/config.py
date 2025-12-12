from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Fitia Backend"
    API_V1_STR: str = "/api/v1"
    FIREBASE_CREDENTIALS_PATH: str = ""
    GEMINI_API_KEY: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings()
