import pymongo
from pymongo import MongoClient
from app.config import settings

client = MongoClient(settings.DATABASE_URL, serverSelectionTimeoutMS=5000)

try:
    conn = client.server_info()
    print(f'Connected to MongoDB {conn.get("version")}')
except Exception as er:
    print(er)
    print("Unable to connect to the MongoDB server.")

db = client[settings.MONGO_INITDB_DATABASE]

User = db.users
User.create_index([("email", pymongo.ASCENDING)], unique=True)
