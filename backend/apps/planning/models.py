from django.db import models
from django.conf import settings
from tasks.models import Task

class TimeSlot(models.Model):
    SLOT_TYPE_CHOICES = [
        ('STUDY', 'Étude'),
        ('BREAK', 'Pause'),
        ('COURSE', 'Cours Fixe'),
        ('PERSONAL', 'Personnel'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='time_slots')
    task = models.ForeignKey(Task, on_delete=models.SET_NULL, null=True, blank=True, related_name='time_slots')
    title = models.CharField(max_length=200)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    slot_type = models.CharField(max_length=20, choices=SLOT_TYPE_CHOICES, default='STUDY')
    is_auto_generated = models.BooleanField(default=False)

    class Meta:
        ordering = ['start_time']

    def __str__(self):
        return f"{self.title} ({self.start_time})"
