from fastapi import APIRouter, Depends, HTTPException
from database.db import db
from utils.auth_middleware import verify_token
from utils.role_checker import admin_only
from pydantic import BaseModel
from typing import List, Optional
from utils.hashing import hash_password
from datetime import datetime

router = APIRouter()


class AdminAddUserRequest(BaseModel):
    full_name: str
    email: str
    password: str
    role: str  # "student" or "teacher" or "admin"
    school_name: Optional[str] = "Edunova High School"
    student_class: Optional[str] = ""


class AdminUpdateUserRequest(BaseModel):
    full_name: str
    role: str
    student_class: Optional[str] = ""
    school_name: Optional[str] = ""


class ClassConfigSchema(BaseModel):
    class_name: str
    sections: List[str]
    subjects: List[str]


class AnnouncementSchema(BaseModel):
    title: str
    content: str
    target_group: str  # "all" or "9th", "10th", etc.


@router.get("/admin/analytics")
def get_admin_analytics(user_data = Depends(verify_token)):
    admin_only(user_data)

    total_students = db["users"].count_documents({"role": "student"})
    total_teachers = db["users"].count_documents({"role": "teacher"})
    total_users = total_students + total_teachers + db["users"].count_documents({"role": "admin"})

    total_notes = db["notes"].count_documents({})
    total_assignments = db["assignments"].count_documents({})
    total_quizzes = db["quizzes"].count_documents({})

    recent_notes = list(db["notes"].find({}).sort("_id", -1).limit(3))
    recent_assignments = list(db["assignments"].find({}).sort("_id", -1).limit(3))
    recent_submissions = list(db["submissions"].find({}).sort("_id", -1).limit(3))

    activities = []
    for n in recent_notes:
        activities.append(f"📘 Note Uploaded: '{n.get('title')}' for Class {n.get('student_class', '')}")
    for a in recent_assignments:
        activities.append(f"📝 Assignment Created: '{a.get('title')}' for Subject {a.get('subject', '')}")
    for s in recent_submissions:
        activities.append(f"👨‍🎓 Assignment Submitted: '{s.get('assignment_title')}' by {s.get('student_email')}")

    return {
        "stats": {
            "total_users": total_users,
            "total_students": total_students,
            "total_teachers": total_teachers,
            "total_notes": total_notes,
            "total_assignments": total_assignments,
            "total_quizzes": total_quizzes
        },
        "recent_activity": activities[:5]
    }


@router.get("/admin/get-teachers")
def get_teachers(user_data = Depends(verify_token)):
    admin_only(user_data)
    teachers = list(db["users"].find({"role": "teacher"}, {"_id": 0, "password": 0}))
    return {"teachers": teachers}


@router.get("/admin/get-students")
def get_students(user_data = Depends(verify_token)):
    admin_only(user_data)
    students = list(db["users"].find({"role": "student"}, {"_id": 0, "password": 0}))
    return {"students": students}


@router.post("/admin/add-user")
def add_user(request: AdminAddUserRequest, user_data = Depends(verify_token)):
    admin_only(user_data)

    exists = db["users"].find_one({"email": request.email})
    if exists:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    hashed_pw = hash_password(request.password)
    db["users"].insert_one({
        "full_name": request.full_name,
        "email": request.email,
        "password": hashed_pw,
        "role": request.role.lower(),
        "school_name": request.school_name,
        "student_class": request.student_class
    })
    return {"message": f"{request.role.capitalize()} registered successfully"}


@router.put("/admin/update-user/{email}")
def update_user(email: str, request: AdminUpdateUserRequest, user_data = Depends(verify_token)):
    admin_only(user_data)

    user = db["users"].find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db["users"].update_one(
        {"email": email},
        {"$set": {
            "full_name": request.full_name,
            "role": request.role.lower(),
            "student_class": request.student_class,
            "school_name": request.school_name
        }}
    )
    return {"message": "User updated successfully"}


@router.delete("/admin/delete-user/{email}")
def delete_user(email: str, user_data = Depends(verify_token)):
    admin_only(user_data)

    if email == user_data["email"]:
        raise HTTPException(status_code=400, detail="Admin cannot self-delete")

    result = db["users"].delete_one({"email": email})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted successfully"}


@router.post("/admin/create-class")
def create_class(request: ClassConfigSchema, user_data = Depends(verify_token)):
    admin_only(user_data)

    exists = db["classes"].find_one({"class_name": request.class_name})
    if exists:
        db["classes"].update_one(
            {"_id": exists["_id"]},
            {"$set": {
                "sections": request.sections,
                "subjects": request.subjects
            }}
        )
        message = "Class updated successfully"
    else:
        db["classes"].insert_one({
            "class_name": request.class_name,
            "sections": request.sections,
            "subjects": request.subjects
        })
        message = "Class created successfully"

    return {"message": message}


@router.get("/admin/get-classes")
def get_classes(user_data = Depends(verify_token)):
    classes = list(db["classes"].find({}, {"_id": 0}))
    return {"classes": classes}


@router.delete("/admin/delete-class/{class_name}")
def delete_class(class_name: str, user_data = Depends(verify_token)):
    admin_only(user_data)
    db["classes"].delete_one({"class_name": class_name})
    return {"message": "Class configuration deleted"}


@router.post("/admin/create-announcement")
def create_announcement(request: AnnouncementSchema, user_data = Depends(verify_token)):
    admin_only(user_data)

    db["announcements"].insert_one({
        "title": request.title,
        "content": request.content,
        "target_group": request.target_group,
        "created_by": user_data["email"],
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M")
    })
    return {"message": "Announcement posted successfully"}


@router.get("/admin/get-announcements")
def get_announcements(user_data = Depends(verify_token)):
    role = user_data.get("role")

    if role == "student":
        student_class = user_data.get("student_class", "")
        announcements = list(db["announcements"].find({
            "target_group": {"$in": ["all", student_class]}
        }, {"_id": 0}).sort("created_at", -1))
    else:
        announcements = list(db["announcements"].find({}, {"_id": 0}).sort("created_at", -1))

    return {"announcements": announcements}


@router.delete("/admin/delete-announcement/{title}")
def delete_announcement(title: str, user_data = Depends(verify_token)):
    admin_only(user_data)
    db["announcements"].delete_one({"title": title})
    return {"message": "Announcement deleted"}


@router.get("/admin/get-content")
def get_content(user_data = Depends(verify_token)):
    admin_only(user_data)

    notes = list(db["notes"].find({}, {"_id": 0}))
    assignments = list(db["assignments"].find({}, {"_id": 0}))
    quizzes = list(db["quizzes"].find({}, {"_id": 0}))

    return {
        "notes": notes,
        "assignments": assignments,
        "quizzes": quizzes
    }
