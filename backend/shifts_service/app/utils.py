from passlib.context import CryptContext
from fastapi import Cookie, HTTPException, status, Depends
from fastapi.responses import Response
from datetime import timedelta
from app.oauth2 import AuthJWT

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def validate_access_token(response: Response, Authorize: AuthJWT = Depends()):
    try:
        access_token = response.cookies.get('access_token')
        if not access_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Access token not found in cookie'
            )

        Authorize.jwt_required()
        return True  # Token is valid
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid or expired access token'
        )

