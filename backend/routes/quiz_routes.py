from fastapi import APIRouter, Depends
import json
from pydantic import BaseModel
from database.db import db
from schemas.quiz_schema import QuizSchema
from schemas.submission_schema import SubmissionSchema
from utils.auth_middleware import verify_token
from utils.role_checker import teacher_only
from ai.quiz_generator import generate_quiz

router = APIRouter()

quiz_collection = db["quizzes"]
result_collection = db["results"]


# CREATE QUIZ
@router.post("/create-quiz")
def create_quiz(
    quiz: QuizSchema,
    user_data=Depends(verify_token)
):

    # Teacher only access
    teacher_only(user_data)

    quiz_data = quiz.dict()

    quiz_data["created_by"] = user_data["email"]

    quiz_collection.insert_one(quiz_data)

    return {
        "message": "Quiz created successfully"
    }


# GET QUIZZES
@router.get("/get-quizzes")
def get_quizzes(
    user_data=Depends(verify_token)
):

    quizzes = list(
        quiz_collection.find({}, {"_id": 0})
    )

    return {
        "quizzes": quizzes
    }


# SUBMIT QUIZ
@router.post("/submit-quiz")
def submit_quiz(
    submission: SubmissionSchema,
    user_data=Depends(verify_token)
):

    quiz = quiz_collection.find_one(
        {"title": submission.title}
    )

    if not quiz:
        return {
            "error": "Quiz not found"
        }

    correct_answers = []

    for question in quiz["questions"]:
        correct_answers.append(
            question["correct_answer"]
        )

    score = 0

    for user_answer, correct_answer in zip(
        submission.answers,
        correct_answers
    ):

        if user_answer == correct_answer:
            score += 1

    # Save result in MongoDB
    result_data = {
        "student_email": user_data["email"],
        "quiz_title": submission.title,
        "score": score,
        "total_questions": len(correct_answers)
    }

    result_collection.insert_one(
        result_data
    )

    return {
        "score": score,
        "total_questions": len(correct_answers)
    }
@router.get("/view-results")
def view_results(
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

    results = list(
        result_collection.find(
            {"student_email": {"$in": student_emails}},
            {"_id": 0}
        )
    )

    return {
        "results": results
    }


@router.get("/get-student-results")
def get_student_results(
    user_data = Depends(verify_token)
):
    email = user_data["email"]
    results = list(
        result_collection.find(
            {"student_email": email},
            {"_id": 0}
        )
    )
    return {
        "results": results
    }


class QuizGenerationRequest(BaseModel):
    text: str


@router.post("/generate-ai-quiz")
def generate_ai_quiz(
    request: QuizGenerationRequest,
    user_data = Depends(verify_token)
):
    teacher_only(user_data)

    raw_quiz = generate_quiz(request.text)

    # Parse and clean response from Gemini
    try:
        cleaned = raw_quiz.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
        
        quiz_dict = json.loads(cleaned)
        return {"quiz": quiz_dict}
    except Exception as e:
        return {
            "error": f"Failed to generate valid JSON: {str(e)}",
            "raw": raw_quiz
        }