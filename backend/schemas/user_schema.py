from pydantic import BaseModel


class UserSchema(BaseModel):

    full_name: str
    school_name: str
    student_class: str

    email: str
    password: str

    role: str