from django.db import models

class CallRecord(models.Model):
    STATUS_CHOICES = [
        ("Answered", "Answered"),
        ("No Answer", "No Answer"),
        ("Busy", "Busy"),
        ("Failed", "Failed"),
    ]
    TAG_CHOICES = [
        ("Important", "Important"),
        ("Evidence", "Evidence"),
        ("Suspect", "Suspect"),
        ("Follow-up", "Follow-up"),
    ]

    date = models.DateTimeField()
    src = models.CharField(max_length=32)
    dst = models.CharField(max_length=32)
    duration = models.CharField(max_length=20, default="0 sec")
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default="No Answer")
    tag = models.CharField(max_length=32, blank=True, null=True, choices=TAG_CHOICES)
    important = models.BooleanField(default=False)
    recording = models.CharField(max_length=255, blank=True, null=True)
    played_count = models.IntegerField(default=0)
    download_count = models.IntegerField(default=0)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return f"{self.src} → {self.dst} [{self.status}]"