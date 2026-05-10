from pydantic import BaseModel
from typing import List


class QuestionSchema(BaseModel):

    question: str
    options: List[str]
    correct_answer: str


class QuizSchema(BaseModel):

    title: str
    questions: List[QuestionSchema]