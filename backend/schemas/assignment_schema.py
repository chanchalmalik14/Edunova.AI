from pydantic import BaseModel


class AssignmentSchema(BaseModel):

    title: str
    description: str