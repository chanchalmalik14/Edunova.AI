from fastapi import APIRouter, Depends

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

    results = list(
        result_collection.find(
            {},
            {"_id": 0}
        )
    )

    return {
        "results": results
    }
@router.post("/generate-ai-quiz")
def generate_ai_quiz():

    sample_notes = """
    Operating System is system software
    that manages computer hardware
    and software resources.
    """

    quiz = generate_quiz(sample_notes)

    return {
        "quiz": quiz
    }