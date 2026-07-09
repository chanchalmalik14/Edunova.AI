from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from schemas.user_schema import UserSchema
from schemas.login_schema import LoginSchema
from utils.jwt_handler import create_access_token
from utils.auth_middleware import verify_token
from fastapi.security import OAuth2PasswordRequestForm
from database.db import db
from utils.role_checker import (
    teacher_only,
    student_only
)

from utils.hashing import (
    hash_password,
    verify_password
)

router = APIRouter()

users_collection = db["users"]


# REGISTER API
@router.post("/register")
def register_user(user: UserSchema):

    # Check if user already exists
    existing_user = users_collection.find_one(
        {"email": user.email}
    )

    if existing_user:
        return {
            "message": "User already exists"
        }

    # Hash password
    hashed_pw = hash_password(user.password)

    # Create user data
    user_data = {
    "full_name": user.full_name,
    "school_name": user.school_name,
    "student_class": user.student_class,

    "email": user.email,
    "password": hashed_pw,

    "role": user.role
}

    # Store in MongoDB
    users_collection.insert_one(user_data)

    return {
        "message": "User registered successfully"
    }


# LOGIN API
@router.post("/login")
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends()
):

    existing_user = users_collection.find_one(
        {"email": form_data.username}
    )

    if not existing_user:
        return {
            "message": "User not found"
        }

    password_match = verify_password(
        form_data.password,
        existing_user["password"]
    )

    if not password_match:
        return {
            "message": "Invalid password"
        }

    token = create_access_token(
    data={

        "email": existing_user["email"],

        "role": existing_user["role"],

        "student_class":
            existing_user["student_class"],

        "school_name":
            existing_user["school_name"]
    }
)

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": existing_user["role"],
        "full_name": existing_user["full_name"]
    }

@router.get("/profile")
def get_profile(user_data = Depends(verify_token)):

    return {
        "message": "Protected profile route",
        "user": user_data
    }

@router.get("/teacher-dashboard")
def teacher_dashboard(
    user_data = Depends(verify_token)
):

    teacher_only(user_data)

    return {
        "message": "Welcome Teacher"
    }
@router.get("/student-dashboard")
def student_dashboard(
    user_data = Depends(verify_token)
):

    student_only(user_data)

    return {
        "message": "Welcome Student"
    }


@router.get("/get-students")
def get_students(
    user_data = Depends(verify_token)
):
    teacher_only(user_data)
    school = user_data.get("school_name", "")
    students = list(
        db["users"].find(
            {"role": "student", "school_name": school},
            {"_id": 0, "password": 0}
        )
    )
    return {
        "students": students
    }


class UpdateProfileRequest(BaseModel):
    name: str
    className: str
    section: str
    email: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


@router.put("/update-profile")
def update_profile(
    request: UpdateProfileRequest,
    user_data = Depends(verify_token)
):
    email = user_data["email"]
    db["users"].update_one(
        {"email": email},
        {"$set": {
            "full_name": request.name,
            "student_class": request.className,
            "section": request.section,
            "email": request.email
        }}
    )
    return {
        "message": "Profile updated successfully"
    }


@router.post("/change-password")
def change_password(
    request: ChangePasswordRequest,
    user_data = Depends(verify_token)
):
    email = user_data["email"]
    user = db["users"].find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(request.current_password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid current password")

    hashed_pw = hash_password(request.new_password)
    db["users"].update_one(
        {"email": email},
        {"$set": {"password": hashed_pw}}
    )
    return {
        "message": "Password updated successfully"
    }