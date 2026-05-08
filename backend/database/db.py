from pymongo import MongoClient

MONGO_URL = "mongodb+srv://chanchal_malik:Windlite1214@cluster.ymawgpb.mongodb.net/?appName=Cluster"

client = MongoClient(MONGO_URL)

db = client["edunova_ai"]

print("MongoDB Connected Successfully")