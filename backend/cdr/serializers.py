from rest_framework import serializers
from .models import CallRecord

class CallSerializer(serializers.ModelSerializer):
    class Meta:
        model = CallRecord
        fields = [
            "id", "date", "src", "dst", "duration",
            "status", "tag", "important", "recording",
            "played_count", "download_count",
        ]