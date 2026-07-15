from fastapi import APIRouter, Depends, UploadFile, File, Form
from fastapi.responses import FileResponse
from typing import Optional
from database.db import db
from schemas.assignment_schema import AssignmentSchema
from utils.auth_middleware import verify_token
from utils.role_checker import teacher_only
import shutil
import os
router = APIRouter()

assignment_collection = db["assignments"]
submission_collection = db["submissions"]


@router.post("/create-assignment")
def create_assignment(
    assignment: AssignmentSchema,
    user_data = Depends(verify_token)
):
    teacher_only(user_data)

    assignment_data = assignment.dict()
    assignment_data["created_by"] = user_data["email"]

    teacher = db["users"].find_one({"email": user_data["email"]})
    school_name = teacher.get("school_name", "") if teacher else ""
    assignment_data["school_name"] = school_name

    assignment_collection.insert_one(
        assignment_data
    )

    return {
        "message": "Assignment created successfully"
    }


@router.get("/get-assignments")
def get_assignments(
    user_data = Depends(verify_token)
):
    student_class = user_data.get("student_class")
    student = db["users"].find_one({"email": user_data["email"]})
    school_name = student.get("school_name", "") if student else ""

    assignments = list(
        assignment_collection.find(
            {
                "student_class": student_class,
                "school_name": {"$regex": f"^{school_name}$", "$options": "i"}
            },
            {"_id": 0}
        )
    )

    return {
        "assignments": assignments
    }
@router.post("/submit-assignment")
def submit_assignment(
    title: str = Form(...),
    text_answer: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    user_data = Depends(verify_token)
):

    file_path = None
    filename = None

    if file:
        # Create uploads folder
        os.makedirs(
            "assignment_submissions",
            exist_ok=True
        )

        file_path = f"assignment_submissions/{file.filename}"

        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer
            )
        filename = file.filename

    submission_data = {
        "assignment_title": title,
        "student_email": user_data["email"],
        "text_answer": text_answer,
        "file_path": file_path,
        "filename": filename
    }

    submission_collection.insert_one(
        submission_data
    )

    return {
        "message": "Assignment submitted successfully"
    }
@router.get("/view-submissions")
def view_submissions(
    user_data = Depends(verify_token)
):

    # Teacher only access
    teacher_only(user_data)
    school = user_data.get("school_name", "")

    # Get student emails from the same school
    school_students = db["users"].find(
        {"role": "student", "school_name": school},
        {"email": 1}
    )
    student_emails = [s["email"] for s in school_students]

    submissions = list(
        submission_collection.find(
            {"student_email": {"$in": student_emails}},
            {"_id": 0}
        )
    )

    return {
        "submissions": submissions
    }


@router.get("/get-teacher-assignments")
def get_teacher_assignments(
    user_data = Depends(verify_token)
):
    teacher_only(user_data)
    assignments = list(
        assignment_collection.find(
            {"created_by": user_data["email"]},
            {"_id": 0}
        )
    )
    return {
        "assignments": assignments
    }


@router.delete("/delete-assignment/{title}")
def delete_assignment(
    title: str,
    user_data = Depends(verify_token)
):
    teacher_only(user_data)
    assignment_collection.delete_one(
        {"title": title, "created_by": user_data["email"]}
    )
    return {
        "message": "Assignment deleted successfully"
    }


@router.get("/download-submission/{filename}")
def download_submission(
    filename: str
):
    file_path = f"assignment_submissions/{filename}"
    if os.path.exists(file_path):
        return FileResponse(file_path, filename=filename)
    return {
        "error": "Submission file not found"
    }