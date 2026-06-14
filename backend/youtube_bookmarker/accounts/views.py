from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import GoogleLoginSerializer
from .services import verify_google_token


class GoogleLoginView(APIView):

    def post(self, request):

        serializer = GoogleLoginSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        credential = serializer.validated_data[
            "credential"
        ]

        user_info = verify_google_token(
            credential
        )

        if not user_info:

            return Response(
                {"error": "Invalid Google Token"},
                status=status.HTTP_400_BAD_REQUEST
            )

        email = user_info.get("email")

        google_id = user_info.get("sub")

        name = user_info.get("name")

        picture = user_info.get("picture")

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": email,
                "google_id": google_id,
                "profile_picture": picture,
                "first_name": name
            }
        )

        refresh = RefreshToken.for_user(
            user
        )

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.first_name,
                "picture": user.profile_picture
            }
        })

class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "email": user.email,
            "name": user.first_name,
            "picture": user.profile_picture
        })