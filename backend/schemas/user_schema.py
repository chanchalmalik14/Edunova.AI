from pydantic import BaseModel
from typing import Optional


class UserSchema(BaseModel):
    full_name: str
    school_name: str
    student_class: str
    section: Optional[str] = ""
    email: str
    password: str
    role: str