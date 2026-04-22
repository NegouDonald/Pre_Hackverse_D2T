from django.db import models
from django.conf import settings

class Tag(models.Model):
    name = models.CharField(max_length=50)
    color = models.CharField(max_length=7, default='#6366F1')  # Hex color
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tags')

    def __str__(self):
        return self.name

class Task(models.Model):
    CATEGORY_CHOICES = [
        ('COURS', 'Cours'),
        ('DEVOIR', 'Devoir'),
        ('EXAMEN', 'Examen'),
        ('PROJET', 'Projet'),
        ('PERSONNEL', 'Personnel'),
    ]
    STATUS_CHOICES = [
        ('TODO', 'À faire'),
        ('IN_PROGRESS', 'En cours'),
        ('DONE', 'Terminé'),
        ('CANCELLED', 'Annulé'),
    ]
    PRIORITY_CHOICES = [
        (1, 'Basse'),
        (2, 'Moyenne'),
        (3, 'Haute'),
        (4, 'Urgente'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='COURS')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='TODO')
    priority = models.IntegerField(choices=PRIORITY_CHOICES, default=2)
    auto_priority_score = models.FloatField(default=0.0)
    
    estimated_duration = models.DurationField(help_text="Durée estimée en minutes")
    actual_duration = models.DurationField(null=True, blank=True)
    
    due_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    tags = models.ManyToManyField(Tag, blank=True, related_name='tasks')
    
    is_recurring = models.BooleanField(default=False)
    recurrence_pattern = models.CharField(
        max_length=20, 
        choices=[('DAILY', 'Quotidien'), ('WEEKLY', 'Hebdomadaire'), ('MONTHLY', 'Mensuel')],
        null=True, blank=True
    )

    class Meta:
        ordering = ['-auto_priority_score', 'due_date']

    def __str__(self):
        return self.title

class StudySession(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='sessions')
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    duration_minutes = models.IntegerField(default=0)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Session for {self.task.title} at {self.started_at}"
