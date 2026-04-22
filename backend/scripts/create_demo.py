import os
import django
import sys
from datetime import timedelta
from django.utils import timezone

# Setup Django environment
sys.path.append('/media/negou/Nouveau nom10/HACkATHON/hackvase/student_time_manager/backend')
sys.path.append('/media/negou/Nouveau nom10/HACkATHON/hackvase/student_time_manager/backend/apps')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User
from tasks.models import Task, Tag, StudySession
from planning.models import TimeSlot
from tasks.services import calculate_priority_score

def create_demo_data():
    # 1. Create User
    user, created = User.objects.get_or_create(
        username='student',
        email='student@gmail.com',
    )
    if created:
        user.set_password('password123')
        user.save()
    
    # 2. Create Tags
    tags_data = [
        ('Urgent', '#EF4444'),
        ('Révision', '#6366F1'),
        ('Projet', '#8B5CF6'),
        ('Perso', '#10B981'),
    ]
    tags = []
    for name, color in tags_data:
        tag, _ = Tag.objects.get_or_create(name=name, color=color, user=user)
        tags.append(tag)

    # 3. Create Tasks
    tasks_data = [
        {
            'title': 'Réviser Examen Mathématiques',
            'category': 'EXAMEN',
            'priority': 4,
            'due_date': timezone.now() + timedelta(days=2),
            'estimated_duration': timedelta(minutes=120),
            'status': 'TODO'
        },
        {
            'title': 'Rendu TP Django',
            'category': 'PROJET',
            'priority': 3,
            'due_date': timezone.now() + timedelta(days=1),
            'estimated_duration': timedelta(minutes=240),
            'status': 'IN_PROGRESS'
        },
        {
            'title': 'Lire cours de Réseaux',
            'category': 'COURS',
            'priority': 2,
            'due_date': timezone.now() + timedelta(days=5),
            'estimated_duration': timedelta(minutes=45),
            'status': 'DONE'
        },
        {
            'title': 'Sport',
            'category': 'PERSONNEL',
            'priority': 1,
            'due_date': timezone.now() + timedelta(days=3),
            'estimated_duration': timedelta(minutes=60),
            'status': 'TODO'
        },
        {
            'title': 'Préparation Soutenance',
            'category': 'PROJET',
            'priority': 4,
            'due_date': timezone.now() + timedelta(hours=12),
            'estimated_duration': timedelta(minutes=90),
            'status': 'TODO'
        }
    ]

    for data in tasks_data:
        task, _ = Task.objects.get_or_create(
            user=user,
            title=data['title'],
            defaults=data
        )
        task.auto_priority_score = calculate_priority_score(task)
        task.save()
        if 'Révision' in task.title:
            task.tags.add(tags[1])

    # 4. Create Planning Slots
    TimeSlot.objects.get_or_create(
        user=user,
        title='Cours de Web',
        start_time=timezone.now().replace(hour=8, minute=0),
        end_time=timezone.now().replace(hour=10, minute=0),
        slot_type='COURSE'
    )
    
    # 5. Create Study Sessions
    task_django = Task.objects.get(title='Rendu TP Django', user=user)
    StudySession.objects.create(
        task=task_django,
        started_at=timezone.now() - timedelta(hours=2),
        ended_at=timezone.now() - timedelta(hours=1),
        duration_minutes=60,
        notes='Début du projet, setup de l\'environnement'
    )

    print("Demo data created successfully!")

if __name__ == '__main__':
    create_demo_data()
