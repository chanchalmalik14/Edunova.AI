from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends
)
from fastapi.responses import FileResponse
from ai.gemini_service import (
    generate_summary
)
from fastapi.responses import FileResponse

import shutil
import os

from database.db import db

from utils.auth_middleware import verify_token
from utils.role_checker import teacher_only

router = APIRouter()

notes_collection = db["notes"]


@router.post("/upload-note")
def upload_note(
    file: UploadFile = File(...),
    user_data = Depends(verify_token)
):

    # Teacher access only
    teacher_only(user_data)

    # Create uploads folder if missing
    os.makedirs("uploads", exist_ok=True)

    # File path
    file_path = f"uploads/{file.filename}"

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Save metadata in MongoDB
    note_data = {
        "filename": file.filename,
        "uploaded_by": user_data["email"],
        "file_path": file_path
    }

    notes_collection.insert_one(note_data)

    return {
        "message": "Note uploaded successfully",
        "filename": file.filename
    }
@router.get("/get-notes")
def get_notes(
    user_data = Depends(verify_token)
):

    notes = list(
        notes_collection.find(
            {},
            {
                "_id": 0
            }
        )
    )

    return {
        "notes": notes
    }
@router.get("/download-note/{filename}")
def download_note(
    filename: str,
    user_data = Depends(verify_token)
):

    file_path = f"uploads/{filename}"

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type='application/octet-stream'
    )
@router.post("/generate-summary")
def generate_note_summary():

    try:

        sample_text = """
        Operating system manages
        hardware and software resources.
        It acts as an interface
        between user and computer.
        """

        summary = generate_summary(sample_text)

        return {
            "summary": summary
        }

    except Exception as e:

        return {
            "error": str(e)
        }
@router.get("/notes")
def get_notes():

    notes = list(notes_collection.find({}, {"_id": 0}))

    return {
        "notes": notes
    }
@router.get("/download-note/{filename}")
def download_note(filename: str):

    file_path = f"uploads/{filename}"

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type='application/octet-stream'
    )