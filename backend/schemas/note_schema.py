from pydantic import BaseModel

class NoteSchema(BaseModel):

    title: str

    subject: str

    student_class: str