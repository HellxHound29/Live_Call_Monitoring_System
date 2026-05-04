import os
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.http import FileResponse, JsonResponse, HttpResponse
from django.conf import settings
from .models import CallRecord
from .serializers import CallSerializer


class CallViewSet(viewsets.ModelViewSet):
    queryset = CallRecord.objects.all()
    serializer_class = CallSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Broadcast new call to all WebSocket clients
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "calls",
            {
                "type": "call_update",
                "data": serializer.data
            }
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
def download_recording(request, filename):
    """
    GET /api/recording/<filename>/
    Serves the .wav file from RECORDING_BASE_PATH
    Supports both download and streaming for browser playback
    """
    safe_name = os.path.basename(filename)
    recording_path = getattr(
        settings,
        "RECORDING_BASE_PATH",
        "/var/spool/asterisk/monitor"
    )
    file_path = os.path.join(recording_path, safe_name)

    if not os.path.exists(file_path):
        return JsonResponse({"error": "Recording not found"}, status=404)

    # Check if request wants to stream (play) or download
    stream = request.GET.get("stream", "false").lower() == "true"

    response = FileResponse(
        open(file_path, "rb"),
        content_type="audio/wav",
    )

    if stream:
        # Inline for browser playback
        response["Content-Disposition"] = f'inline; filename="{safe_name}"'
        response["Accept-Ranges"] = "bytes"
    else:
        # Attachment for download
        response["Content-Disposition"] = f'attachment; filename="{safe_name}"'

    # Allow frontend to access
    response["Access-Control-Allow-Origin"] = "*"
    return response