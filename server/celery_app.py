from celery import Celery
from celery.schedules import crontab
import os
from dotenv import load_dotenv

load_dotenv()

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", "")

# Create Redis URL
if REDIS_PASSWORD:
    redis_url = f"redis://:{REDIS_PASSWORD}@{REDIS_HOST}:{REDIS_PORT}/0"
else:
    redis_url = f"redis://{REDIS_HOST}:{REDIS_PORT}/0"

# Initialize Celery app
celery_app = Celery(
    "vscode_clone_tasks",
    broker=redis_url,
    backend=redis_url,
    include=["celery_tasks"]
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    broker_connection_retry_on_startup=True,
)

# Celery Beat schedule - periodic tasks
celery_app.conf.beat_schedule = {
    "process-pending-tasks-every-5-seconds": {
        "task": "celery_tasks.process_pending_tasks",
        "schedule": 5.0,  # Run every 5 seconds
    },
}
