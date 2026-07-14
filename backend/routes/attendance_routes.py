from fastapi import APIRouter, Depends, HTTPException
from database.db import db
from utils.auth_middleware import verify_token
from utils.role_checker import teacher_only
from pydantic import BaseModel
from typing import List

router = APIRouter()
attendance_collection = db["attendance"]


class AttendanceRecord(BaseModel):
    student_email: str
    student_name: str
    status: str  # "present" or "absent"


class SubmitAttendanceRequest(BaseModel):
    date: str  # YYYY-MM-DD
    class_name: str
    records: List[AttendanceRecord]


@router.post("/submit-attendance")
def submit_attendance(
    request: SubmitAttendanceRequest,
    user_data = Depends(verify_token)
):
    teacher_only(user_data)
    school_name = user_data.get("school_name", "")

    existing = attendance_collection.find_one({
        "date": request.date,
        "class_name": request.class_name,
        "school_name": school_name
    })

    records_data = [rec.dict() for rec in request.records]

    if existing:
        attendance_collection.update_one(
            {"_id": existing["_id"]},
            {"$set": {
                "records": records_data,
                "marked_by": user_data["email"]
            }}
        )
        message = "Attendance updated successfully"
    else:
        attendance_collection.insert_one({
            "date": request.date,
            "class_name": request.class_name,
            "records": records_data,
            "marked_by": user_data["email"],
            "school_name": school_name
        })
        message = "Attendance saved successfully"

    return {"message": message}


@router.get("/get-student-attendance")
def get_student_attendance(
    user_data = Depends(verify_token)
):
    email = user_data["email"]

    logs = list(attendance_collection.find({}, {"_id": 0}))

    student_records = []
    present_count = 0
    absent_count = 0

    for log in logs:
        for rec in log.get("records", []):
            if rec["student_email"] == email:
                student_records.append({
                    "date": log["date"],
                    "class_name": log["class_name"],
                    "status": rec["status"]
                })
                if rec["status"] == "present":
                    present_count += 1
                else:
                    absent_count += 1
                break

    total_days = present_count + absent_count
    attendance_percent = int((present_count / total_days) * 100) if total_days > 0 else 100

    return {
        "records": student_records,
        "stats": {
            "present_days": present_count,
            "absent_days": absent_count,
            "total_days": total_days,
            "percentage": f"{attendance_percent}%"
        }
    }


@router.get("/get-class-attendance")
def get_class_attendance(
    class_name: str,
    date: str,
    user_data = Depends(verify_token)
):
    teacher_only(user_data)

    existing = attendance_collection.find_one(
        {"date": date, "class_name": class_name},
        {"_id": 0}
    )

    if not existing:
        return {"records": []}

    return existing
