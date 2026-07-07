import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv(
    "MONGO_URL",
    "mongodb+srv://chanchal_malik:Windlite1214@cluster.ymawgpb.mongodb.net/?appName=Cluster"
)

client = MongoClient(MONGO_URL)

db = client["edunova_ai"]

print("MongoDB Connected Successfully")