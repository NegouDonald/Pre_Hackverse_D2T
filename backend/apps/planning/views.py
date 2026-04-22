from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import TimeSlot
from .serializers import TimeSlotSerializer
from tasks.models import Task
from tasks.serializers import TaskSerializer

class TimeSlotViewSet(viewsets.ModelViewSet):
    serializer_class = TimeSlotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TimeSlot.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        slots_data = request.data
        if not isinstance(slots_data, list):
            return Response({"error": "Expected a list of slots"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=slots_data, many=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def auto_schedule(self, request):
        """
        Génération automatique du planning basée sur les tâches prioritaires.
        """
        user = request.user
        tasks = Task.objects.filter(user=user, status__in=['TODO', 'IN_PROGRESS']).order_by('-auto_priority_score')
        
        # On commence à l'heure actuelle (arrondie à la demi-heure)
        now = timezone.now().replace(second=0, microsecond=0)
        if now.minute < 30:
            now = now.replace(minute=30)
        else:
            now = (now + timezone.timedelta(hours=1)).replace(minute=0)
            
        current_time = now
        
        # Fin de journée par défaut à 21h UTC
        end_of_day = now.replace(hour=21, minute=0) 
        
        suggestions = []
        for task in tasks:
            if current_time >= end_of_day:
                break
                
            task_duration = task.estimated_duration or timezone.timedelta(minutes=60)
            # On limite les blocs à 2h max pour l'auto-scheduling
            actual_duration = min(task_duration, timezone.timedelta(hours=2))
            
            end_time = current_time + actual_duration
            
            if end_time > end_of_day:
                break
                
            suggestions.append({
                "title": f"Focus: {task.title}",
                "task": task.id,
                "start_time": current_time,
                "end_time": end_time,
                "slot_type": 'STUDY',
                "is_auto_generated": True
            })
            
            # Pause de 10 min
            break_end = end_time + timezone.timedelta(minutes=10)
            if break_end < end_of_day:
                suggestions.append({
                    "title": "Pause méritée",
                    "start_time": end_time,
                    "end_time": break_end,
                    "slot_type": 'BREAK',
                    "is_auto_generated": True
                })
                current_time = break_end
            else:
                current_time = end_time

        return Response(suggestions)
