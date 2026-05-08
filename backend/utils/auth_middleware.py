from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from utils.jwt_handler import verify_access_token

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="login"
)


def verify_token(
    token: str = Depends(oauth2_scheme)
):

    payload = verify_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    return payload