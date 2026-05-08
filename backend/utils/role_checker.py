from fastapi import HTTPException


def teacher_only(user_data):

    if user_data["role"] != "teacher":

        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )
def student_only(user_data):

    if user_data["role"] != "student":

        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )