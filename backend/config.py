# Configuration settings
import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # App settings
    app_name: str = "Tripscape"
    port: int = 8000
    environment: str = "development"
    debug: bool = False
    
    # CORS settings
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    
    # Security settings
    secret_key: str = "your-secret-key-change-in-production"
    api_key: str = ""
    
    # Database (for future use)
    database_url: str = ""
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Convert comma-separated CORS origins to list"""
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    @property
    def is_production(self) -> bool:
        """Check if running in production"""
        return self.environment.lower() == "production"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
