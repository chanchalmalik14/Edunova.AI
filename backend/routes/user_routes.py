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
from datetime import datetime

router = APIRouter()

users_collection = db["users"]
schools_collection = db["schools"]


# ─────────────────────────────────────────────
# PUBLIC: List Registered Schools (for dropdown)
# ─────────────────────────────────────────────
@router.get("/schools")
def get_schools():
    schools = list(schools_collection.find({}, {"_id": 0, "name": 1}))
    return {"schools": [s["name"] for s in schools]}


# ─────────────────────────────────────────────
# REGISTER API — Secure Role-Based Registration
# ─────────────────────────────────────────────
@router.post("/register")
def register_user(user: UserSchema):

    # Block admin self-registration from the public page
    if user.role.lower() == "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin accounts cannot be self-registered. Contact your school administrator or the Edunova team."
        )

    # Validate that the school exists in our platform
    school = schools_collection.find_one({"name": {"$regex": f"^{user.school_name}$", "$options": "i"}})
    if not school:
        raise HTTPException(
            status_code=400,
            detail=f"School '{user.school_name}' is not registered on Edunova. Please contact your school administrator."
        )

    # Use the canonical school name from the database
    canonical_school_name = school["name"]

    # Check if user already exists
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists."
        )

    # Hash password
    hashed_pw = hash_password(user.password)

    # Teachers start as "pending" — require admin approval
    status = "pending" if user.role.lower() == "teacher" else "active"

    # Create user data
    user_data = {
        "full_name": user.full_name,
        "school_name": canonical_school_name,
        "student_class": user.student_class,
        "section": user.section,
        "email": user.email,
        "password": hashed_pw,
        "role": user.role.lower(),
        "status": status,
        "registered_at": datetime.now().strftime("%Y-%m-%d %H:%M")
    }

    # Store in MongoDB
    users_collection.insert_one(user_data)

    if status == "pending":
        return {
            "message": "Teacher registration submitted",
            "status": "pending",
            "detail": "Your account is pending approval by your school admin. You will be able to log in once approved."
        }

    return {
        "message": "User registered successfully",
        "status": "active"
    }


# ─────────────────────────────────────────────
# LOGIN API
# ─────────────────────────────────────────────
@router.post("/login")
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends()
):
    existing_user = users_collection.find_one({"email": form_data.username})

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="No account found with this email address."
        )

    password_match = verify_password(
        form_data.password,
        existing_user["password"]
    )

    if not password_match:
        raise HTTPException(
            status_code=401,
            detail="Incorrect password. Please try again."
        )

    # Block pending users from logging in
    user_status = existing_user.get("status", "active")
    if user_status == "pending":
        raise HTTPException(
            status_code=403,
            detail="Your teacher account is pending approval by your school admin. Please wait for approval."
        )

    token = create_access_token(
        data={
            "email": existing_user["email"],
            "role": existing_user["role"],
            "student_class": existing_user.get("student_class", ""),
            "school_name": existing_user.get("school_name", "")
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": existing_user["role"],
        "full_name": existing_user["full_name"]
    }


@router.get("/profile")
def get_profile(user_data=Depends(verify_token)):
    return {
        "message": "Protected profile route",
        "user": user_data
    }


@router.get("/teacher-dashboard")
def teacher_dashboard(user_data=Depends(verify_token)):
    teacher_only(user_data)
    return {"message": "Welcome Teacher"}


@router.get("/student-dashboard")
def student_dashboard(user_data=Depends(verify_token)):
    student_only(user_data)
    return {"message": "Welcome Student"}


@router.get("/get-students")
def get_students(user_data=Depends(verify_token)):
    teacher_only(user_data)
    school = user_data.get("school_name", "")
    students = list(
        db["users"].find(
            {"role": "student", "school_name": school},
            {"_id": 0, "password": 0}
        )
    )
    return {"students": students}


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
    user_data=Depends(verify_token)
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
    return {"message": "Profile updated successfully"}


@router.post("/change-password")
def change_password(
    request: ChangePasswordRequest,
    user_data=Depends(verify_token)
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
    return {"message": "Password updated successfully"}