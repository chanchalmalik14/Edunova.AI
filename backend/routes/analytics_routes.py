from fastapi import APIRouter, Depends
from database.db import db
from utils.auth_middleware import verify_token

router = APIRouter()

@router.get("/analytics")
def get_analytics(user_data = Depends(verify_token)):
    role = user_data.get("role")
    email = user_data.get("email")

    if role == "student":
        student = db["users"].find_one({"email": email})
        school = student.get("school_name", "").strip() if student else ""

        # Fetch school quizzes to filter out old, stale, or external test-run result logs
        school_quizzes = list(db["quizzes"].find(
            {"school_name": {"$regex": f"^{school}$", "$options": "i"}}
        ))
        school_quiz_titles = [q["title"] for q in school_quizzes]

        # 1. Quizzes Completed
        quiz_results = list(db["results"].find({
            "student_email": email,
            "quiz_title": {"$in": school_quiz_titles}
        }))
        quizzes_completed = len(quiz_results)
        quiz_titles = [res.get("quiz_title") for res in quiz_results]

        # 2. Learning Score (Average Quiz Performance as a %)
        if quizzes_completed > 0:
            total_score = sum(res.get("score", 0) for res in quiz_results)
            total_questions = sum(res.get("total_questions", 0) for res in quiz_results)
            learning_score = int((total_score / total_questions) * 100) if total_questions > 0 else 0
        else:
            learning_score = 0

        # 3. Assignments Completed
        assignments_completed = db["submissions"].count_documents({"student_email": email})

        # 4. Notes Available for student's class & school
        student_class = user_data.get("student_class")
        notes_available = db["notes"].count_documents({
            "student_class": student_class,
            "school_name": {"$regex": f"^{school}$", "$options": "i"}
        })

        return {
            "role": "student",
            "stats": {
                "quizzes_completed": quizzes_completed,
                "learning_score": f"{learning_score}%",
                "assignments_completed": assignments_completed,
                "notes_available": notes_available,
                "quiz_titles": quiz_titles
            }
        }

    elif role == "teacher":
        school = user_data.get("school_name", "")
        # 1. Total Students in the teacher's school
        total_students = db["users"].count_documents({"role": "student", "school_name": school})

        # 2. Assignments Created by this teacher
        assignments_created = db["assignments"].count_documents({"created_by": email})

        # 3. Notes Uploaded by this teacher
        notes_uploaded = db["notes"].count_documents({"uploaded_by": email})

        return {
            "role": "teacher",
            "stats": {
                "total_students": total_students,
                "assignments_created": assignments_created,
                "notes_uploaded": notes_uploaded
            }
        }

    else:
        return {
            "error": "Invalid role"
        }
