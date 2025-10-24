from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime
import pytz, json
from croniter import croniter
from db import db, redis_client
from bson import ObjectId

async def check_and_push_tasks():
    now = datetime.utcnow().replace(tzinfo=pytz.utc)
    cursor = db.tasks.find({
        "start_date": {"$lte": now},
        "end_date": {"$gte": now},
        "next_run": {"$lte": now}
    })
    async for task in cursor:
        try:
            payload = {
                "_id": str(task["_id"]),
                "name": task["name"],
                "cron": task.get("cron"),
                "next_run": task.get("next_run").isoformat() if task.get("next_run") else None
            }
            await redis_client.lpush("pending_tasks", json.dumps(payload))
            
            # Advance next_run
            if task.get("cron") and task.get("next_run"):
                itr = croniter(task["cron"], task["next_run"])
                next_dt = itr.get_next(datetime)
                if next_dt.tzinfo is None:
                    next_dt = pytz.utc.localize(next_dt)
                await db.tasks.update_one({"_id": task["_id"]}, {"$set": {"next_run": next_dt}})
        except Exception as e:
            print("Error processing task:", e)

def start_scheduler():
    scheduler = AsyncIOScheduler()
    scheduler.add_job(check_and_push_tasks, IntervalTrigger(seconds=10))
    scheduler.start()
