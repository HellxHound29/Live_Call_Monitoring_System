from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import CallViewSet, download_recording

router = DefaultRouter()
router.register("calls", CallViewSet)

urlpatterns = router.urls + [
    path("recording/<str:filename>/", download_recording, name="cdr-recording"),
]