from fastapi import APIRouter, Depends

from database.db import db

from schemas.assignment_schema import AssignmentSchema

from utils.auth_middleware import verify_token
from utils.role_checker import teacher_only
from fastapi import UploadFile, File
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

    assignments = list(
        assignment_collection.find(
            {},
            {"_id": 0}
        )
    )

    return {
        "assignments": assignments
    }
@router.post("/submit-assignment")
def submit_assignment(
    title: str,
    file: UploadFile = File(...),
    user_data = Depends(verify_token)
):

    # Create uploads folder
    os.makedirs(
        "assignment_submissions",
        exist_ok=True
    )

    file_path = (
        f"assignment_submissions/{file.filename}"
    )

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    submission_data = {
        "assignment_title": title,
        "student_email": user_data["email"],
        "file_path": file_path,
        "filename": file.filename
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