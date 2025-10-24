from celery_app import celery_app
import redis
import json
import os
from dotenv import load_dotenv

load_dotenv()

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", "")

# Create synchronous Redis client for Celery (Celery doesn't work with async Redis)
if REDIS_PASSWORD:
    redis_client = redis.Redis(
        host=REDIS_HOST,
        port=REDIS_PORT,
        password=REDIS_PASSWORD,
        decode_responses=True
    )
else:
    redis_client = redis.Redis(
        host=REDIS_HOST,
        port=REDIS_PORT,
        decode_responses=True
    )


@celery_app.task(name="celery_tasks.process_pending_tasks")
def process_pending_tasks():
    """
    Periodic task that picks up items from Redis queue (dropped by FastAPI scheduler)
    and processes them by printing the task name.
    """
    try:
        # Check how many tasks are in the queue
        queue_length = redis_client.llen("pending_tasks")
        
        if queue_length == 0:
            print("No pending tasks in Redis queue")
            return {"status": "no_tasks", "processed": 0}
        
        print(f"Found {queue_length} pending tasks in Redis queue")
        
        processed_count = 0
        
        # Process all available tasks
        while True:
            # Pop task from Redis list (FIFO)
            task_json = redis_client.rpop("pending_tasks")
            
            if task_json is None:
                break
            
            try:
                task_data = json.loads(task_json)
                task_name = task_data.get("name", "Unknown Task")
                task_id = task_data.get("_id", "Unknown ID")
                
                # Process the task - print the name
                print(f"🔄 Processing Task: {task_name} (ID: {task_id})")
                print(f"   Task Details: {task_data}")
                
                # Here you can add more processing logic
                # For now, we just print the name as requested
                
                processed_count += 1
                
            except json.JSONDecodeError as e:
                print(f"Error decoding task JSON: {e}")
                continue
        
        print(f"✅ Processed {processed_count} tasks from Redis queue")
        return {"status": "success", "processed": processed_count}
        
    except Exception as e:
        print(f"❌ Error in process_pending_tasks: {e}")
        return {"status": "error", "message": str(e)}


@celery_app.task(name="celery_tasks.print_task_name")
def print_task_name(task_name: str, task_id: str = None):
    """
    Simple task to print a task name.
    Can be called directly if needed.
    """
    print(f"📋 Task Name: {task_name}")
    if task_id:
        print(f"   Task ID: {task_id}")
    return {"task_name": task_name, "task_id": task_id}
