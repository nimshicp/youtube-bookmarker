from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings


def verify_google_token(token):

    try:
        user_info = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )

        return user_info

    except Exception:
        return None