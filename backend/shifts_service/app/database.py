import pymongo
from pymongo import MongoClient
from app.config import settings

client = MongoClient(settings.DATABASE_URL, serverSelectionTimeoutMS=5000)

try:
    conn = client.server_info()
    print(f'Connected to MongoDB {conn.get("version")}')
except Exception:
    print("Unable to connect to the MongoDB server.")

db = client[settings.MONGO_INITDB_DATABASE]

Guard = db.guards
Shift = db.shifts
Schedule = db.schedules

Guard.create_index([("name", pymongo.ASCENDING)])
Shift.create_index([("schedule_id", pymongo.ASCENDING)])
