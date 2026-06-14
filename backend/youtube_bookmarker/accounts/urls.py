from django.urls import path

from .views import GoogleLoginView, UserMeView

urlpatterns = [
    path(
        "google/",
        GoogleLoginView.as_view()
    ),
    path(
        "me/",
        UserMeView.as_view()
    )
]