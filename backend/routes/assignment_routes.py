from fastapi import APIRouter, Depends, UploadFile, File, Form
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

    # Teacher only
    teacher_only(user_data)

    assignment_data = assignment.dict()

    assignment_data["created_by"] = user_data["email"]

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

    student_class = user_data.get(
        "student_class"
    )

    assignments = list(

        assignment_collection.find(
            {
                "student_class":
                    student_class
            },

            {
                "_id": 0
            }
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

    submissions = list(
        submission_collection.find(
            {},
            {"_id": 0}
        )
    )

    return {
        "submissions": submissions
    }