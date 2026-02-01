"""Server entry point for running the application."""

import uvicorn

from app.config.settings import get_settings
from app.lifecycle.signals import setup_signal_handlers
from app.main import app
from app.utils.logger import logger


def main() -> None:
    """Run the FastAPI application with uvicorn."""
    setup_signal_handlers()
    settings = get_settings()

    logger.info(f"Starting server in {settings.ENVIRONMENT} mode...")

    uvicorn.run(
        "app.main:app",  # Import string for hot reload
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.ENVIRONMENT != "production",
        log_config=None,  # Use custom logging
        access_log=False,  # Custom access logging via middleware
        workers=settings.WORKERS if settings.ENVIRONMENT == "production" else 1,
    )


if __name__ == "__main__":
    main()

