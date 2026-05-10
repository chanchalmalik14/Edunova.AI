from pydantic import BaseModel
from typing import List


class SubmissionSchema(BaseModel):

    title: str
    answers: List[str]