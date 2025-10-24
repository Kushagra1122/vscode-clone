# Server (FastAPI + Celery) — Setup

Quick setup:

1. Create and activate a virtualenv (recommended):

```bash
python3 -m venv .venv
source .venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set environment variables (optional, defaults are sensible):

- MONGODB_URL (default: mongodb://localhost:27017)
- MONGODB_DB_NAME (default: vscode_clone)
- REDIS_HOST (default: localhost)
- REDIS_PORT (default: 6379)
- REDIS_PASSWORD (default: empty)

4. Make sure Redis is running:

```bash
# On macOS with Homebrew
brew services start redis

# Or run Redis directly
redis-server
```

5. Run the FastAPI server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The scheduler starts on FastAPI startup and will push due tasks to Redis list `pending_tasks`.

6. Run the Celery worker (in a separate terminal):

```bash
celery -A celery_app worker --loglevel=info
```

7. Run the Celery Beat scheduler (in another separate terminal):

```bash
celery -A celery_app beat --loglevel=info
```

## Architecture

- **FastAPI** runs a scheduler (APScheduler) that checks for due tasks every 10 seconds and pushes them to Redis list `pending_tasks`
- **Celery Beat** runs a periodic task every 5 seconds that picks up items from the Redis queue
- **Celery Worker** processes the tasks and prints the task name

## Alternative: Run Celery Worker and Beat together

You can run both the worker and beat scheduler in a single process:

```bash
celery -A celery_app worker --beat --loglevel=info
```
