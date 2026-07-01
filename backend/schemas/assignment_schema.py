from pydantic import BaseModel

class AssignmentSchema(BaseModel):

    title: str

    subject: str

    description: str

    student_class: str

    due_date: str