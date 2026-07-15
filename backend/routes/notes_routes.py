from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    Form
)
from fastapi.responses import FileResponse
from typing import Optional
from ai.gemini_service import (
    generate_summary,
    generate_multimodal_summary
)
import shutil
import os

from database.db import db

from utils.auth_middleware import verify_token
from utils.role_checker import teacher_only

router = APIRouter()

notes_collection = db["notes"]


@router.post("/upload-note")
def upload_note(

    title: str = Form(...),

    subject: str = Form(...),

    student_class: str = Form(...),

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
    teacher = db["users"].find_one({"email": user_data["email"]})
    school_name = teacher.get("school_name", "") if teacher else ""

    note_data = {
        "title": title,
        "subject": subject,
        "student_class": student_class,
        "filename": file.filename,
        "uploaded_by": user_data["email"],
        "school_name": school_name,
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
    student_class = user_data.get("student_class")
    student = db["users"].find_one({"email": user_data["email"]})
    school_name = student.get("school_name", "") if student else ""

    notes = list(
        notes_collection.find(
            {
                "student_class": student_class,
                "school_name": {"$regex": f"^{school_name}$", "$options": "i"}
            },
            {"_id": 0}
        )
    )

    return {
        "notes": notes
    }

from pydantic import BaseModel

class SummaryRequest(BaseModel):
    text: str

@router.post("/generate-summary")
def generate_note_summary(
    request: SummaryRequest,
    user_data = Depends(verify_token)
):
    try:
        summary = generate_summary(request.text)
        return {
            "summary": summary
        }
    except Exception as e:
        return {
            "error": str(e)
        }


@router.post("/generate-file-summary")
async def generate_file_summary(
    file: UploadFile = File(...),
    prompt: Optional[str] = Form(None),
    user_data = Depends(verify_token)
):
    try:
        file_bytes = await file.read()
        summary = generate_multimodal_summary(
            file_bytes=file_bytes,
            mime_type=file.content_type,
            user_prompt=prompt
        )
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


@router.get("/get-teacher-notes")
def get_teacher_notes(
    user_data = Depends(verify_token)
):
    teacher_only(user_data)
    notes = list(
        notes_collection.find(
            {"uploaded_by": user_data["email"]},
            {"_id": 0}
        )
    )
    return {
        "notes": notes
    }


@router.delete("/delete-note/{filename}")
def delete_note(
    filename: str,
    user_data = Depends(verify_token)
):
    teacher_only(user_data)
    # Remove file from local disk
    note = notes_collection.find_one(
        {"filename": filename, "uploaded_by": user_data["email"]}
    )
    if note and os.path.exists(note["file_path"]):
        try:
            os.remove(note["file_path"])
        except Exception as e:
            print(f"Error removing file: {e}")

    notes_collection.delete_one(
        {"filename": filename, "uploaded_by": user_data["email"]}
    )
    return {
        "message": "Note deleted successfully"
    }