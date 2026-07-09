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


def admin_only(user_data):
    if user_data.get("role") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access denied"
        )