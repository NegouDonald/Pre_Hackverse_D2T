from django.utils import timezone
import math

def calculate_priority_score(task):
    """
    Score de 0 à 100 basé sur plusieurs facteurs pondérés.
    """
    now = timezone.now()
    score = 0

    # 1. URGENCE TEMPORELLE (40 points max)
    if task.due_date:
        hours_remaining = (task.due_date - now).total_seconds() / 3600
        if hours_remaining <= 0:
            urgency = 40  # En retard → score max
        elif hours_remaining <= 24:
            urgency = 40 * (1 - hours_remaining/24) + 30
        elif hours_remaining <= 72:
            urgency = 20 + (20 * (72 - hours_remaining) / 48)
        else:
            urgency = max(0, 20 - math.log(hours_remaining/72) * 5)
        score += min(40, urgency)

    # 2. PRIORITÉ MANUELLE (30 points max)
    priority_map = {1: 5, 2: 15, 3: 22, 4: 30}
    score += priority_map.get(task.priority, 0)

    # 3. CATÉGORIE / IMPORTANCE (15 points max)
    category_weight = {
        'EXAMEN': 15, 'DEVOIR': 12, 'PROJET': 10,
        'COURS': 7, 'PERSONNEL': 3
    }
    score += category_weight.get(task.category, 5)

    # 4. DURÉE ESTIMÉE (10 points max)
    if task.estimated_duration:
        minutes = task.estimated_duration.total_seconds() / 60
        if minutes <= 30:
            score += 10
        elif minutes <= 60:
            score += 7
        elif minutes <= 120:
            score += 4
        else:
            score += 1

    # 5. BONUS RETARD (5 points)
    if task.due_date and task.due_date < now and task.status != 'DONE':
        score += 5

    return round(min(100, score), 2)
