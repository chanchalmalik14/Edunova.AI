from fastapi import FastAPI
from database.db import db
from routes.user_routes import router as user_router
from routes.notes_routes import (
    router as notes_router
)
from routes.quiz_routes import router as quiz_router
from routes.assignment_routes import router as assignment_router
from routes.analytics_routes import router as analytics_router
from routes.attendance_routes import router as attendance_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(user_router)
app.include_router(notes_router)
app.include_router(quiz_router)
app.include_router(assignment_router)
app.include_router(analytics_router)
app.include_router(attendance_router)


@app.get("/")
def home():
    return {
        "message": "EduNova AI Backend Running Successfully"
    }