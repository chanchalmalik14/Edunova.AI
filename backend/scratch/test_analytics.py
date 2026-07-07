import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import Depends
from utils.jwt_handler import create_access_token
from routes.analytics_routes import get_analytics
from database.db import db

# Clean up / create test environment in MongoDB
print("Setting up test data...")
users_col = db["users"]
results_col = db["results"]
submissions_col = db["submissions"]
notes_col = db["notes"]

# 1. Test Student
student_email = "test_student@edunova.ai"
# Clean existing test data
users_col.delete_many({"email": student_email})
results_col.delete_many({"student_email": student_email})
submissions_col.delete_many({"student_email": student_email})
notes_col.delete_many({"student_class": "10A_Test"})

# Insert student profile
users_col.insert_one({
    "full_name": "Test Student",
    "email": student_email,
    "role": "student",
    "student_class": "10A_Test"
})

# Insert quiz results
results_col.insert_many([
    {"student_email": student_email, "quiz_title": "Quiz 1", "score": 4, "total_questions": 5},
    {"student_email": student_email, "quiz_title": "Quiz 2", "score": 3, "total_questions": 5}
])

# Insert assignment submissions
submissions_col.insert_one({
    "student_email": student_email,
    "assignment_title": "Homework 1"
})

# Insert study notes
notes_col.insert_many([
    {"title": "Note 1", "student_class": "10A_Test"},
    {"title": "Note 2", "student_class": "10A_Test"},
    {"title": "Note 3", "student_class": "10A_Test"}
])

# Call the analytics function directly with mocked user data
print("\nTesting Student Analytics...")
student_user_data = {
    "email": student_email,
    "role": "student",
    "student_class": "10A_Test"
}

student_result = get_analytics(student_user_data)
print("Student Response:", student_result)
assert student_result["stats"]["quizzes_completed"] == 2
assert student_result["stats"]["learning_score"] == "70%" # (4+3)/(5+5) = 70%
assert student_result["stats"]["assignments_completed"] == 1
assert student_result["stats"]["notes_available"] == 3
print("[SUCCESS] Student analytics test passed successfully!")


# 2. Test Teacher
teacher_email = "test_teacher@edunova.ai"
# Clean existing test data
users_col.delete_many({"email": teacher_email})
db["assignments"].delete_many({"created_by": teacher_email})
notes_col.delete_many({"uploaded_by": teacher_email})

# Insert teacher profile
users_col.insert_one({
    "full_name": "Test Teacher",
    "email": teacher_email,
    "role": "teacher"
})

# Insert assignments created by this teacher
db["assignments"].insert_many([
    {"title": "HW 1", "created_by": teacher_email},
    {"title": "HW 2", "created_by": teacher_email}
])

# Insert notes uploaded by this teacher
notes_col.insert_many([
    {"title": "Math Note", "uploaded_by": teacher_email},
    {"title": "Phys Note", "uploaded_by": teacher_email}
])

print("\nTesting Teacher Analytics...")
teacher_user_data = {
    "email": teacher_email,
    "role": "teacher"
}

teacher_result = get_analytics(teacher_user_data)
print("Teacher Response:", teacher_result)
assert teacher_result["stats"]["assignments_created"] == 2
assert teacher_result["stats"]["notes_uploaded"] == 2
print("[SUCCESS] Teacher analytics test passed successfully!")

# Clean up test data
print("\nCleaning up test database documents...")
users_col.delete_many({"email": student_email})
results_col.delete_many({"student_email": student_email})
submissions_col.delete_many({"student_email": student_email})
notes_col.delete_many({"student_class": "10A_Test"})

users_col.delete_many({"email": teacher_email})
db["assignments"].delete_many({"created_by": teacher_email})
notes_col.delete_many({"uploaded_by": teacher_email})
print("Cleanup complete.")
