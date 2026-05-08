from fastapi import FastAPI
from database.db import db
from routes.user_routes import router as user_router

app = FastAPI()

app.include_router(user_router)


@app.get("/")
def home():
    return {
        "message": "EduNova AI Backend Running Successfully"
    }