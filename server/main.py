from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from db import db
from models import TaskIn, TaskOut
from scheduler import start_scheduler
from datetime import datetime
import pytz
from croniter import croniter

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.on_event("startup")
async def startup_event():
    start_scheduler()
    print("Scheduler started")

@app.post("/tasks", response_model=TaskOut)
async def create_task(task: TaskIn):
    now_utc = datetime.utcnow().replace(tzinfo=pytz.utc)
    ist = pytz.timezone("Asia/Kolkata")

    def to_utc(dt):
        if dt is None:
            return None
        return dt.astimezone(pytz.utc) if dt.tzinfo else ist.localize(dt).astimezone(pytz.utc)

    data = task.dict()
    data["next_run"] = to_utc(data.get("next_run")) or now_utc
    data["start_date"] = to_utc(data.get("start_date")) or now_utc
    data["end_date"] = to_utc(data.get("end_date")) or now_utc.replace(year=now_utc.year+1)

    if data.get("cron"):
        itr = croniter(data["cron"], data["next_run"])
        if data["next_run"] <= now_utc:
            data["next_run"] = itr.get_next(datetime).astimezone(pytz.utc)

    result = await db.tasks.insert_one({k:v for k,v in data.items() if v is not None})
    saved_task = await db.tasks.find_one({"_id": result.inserted_id})
    saved_task["_id"] = str(saved_task["_id"])
    return saved_task

@app.get("/tasks", response_model=list[TaskOut])
async def list_tasks():
    tasks = []
    async for t in db.tasks.find():
        t["_id"] = str(t["_id"])
        tasks.append(t)
    return tasks
