from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Task, Tag, StudySession
from .serializers import TaskSerializer, TagSerializer, StudySessionSerializer
from .services import calculate_priority_score
from django_filters.rest_framework import DjangoFilterBackend

class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Tag.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'category']
    search_fields = ['title', 'description']
    ordering_fields = ['due_date', 'priority', 'auto_priority_score', 'created_at']

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user).order_by('-auto_priority_score', 'due_date')

    def perform_create(self, serializer):
        task = serializer.save(user=self.request.user)
        task.auto_priority_score = calculate_priority_score(task)
        task.save()

    def perform_update(self, serializer):
        task = serializer.save()
        task.auto_priority_score = calculate_priority_score(task)
        task.save()

    @action(detail=False, methods=['post'])
    def auto_prioritize(self, request):
        tasks = Task.objects.filter(user=request.user).exclude(status='DONE')
        for task in tasks:
            task.auto_priority_score = calculate_priority_score(task)
            task.save()
        
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def start_session(self, request, pk=None):
        task = self.get_object()
        # End any active sessions for the user (optional, but good practice)
        StudySession.objects.filter(task__user=request.user, ended_at__isnull=True).update(ended_at=timezone.now())
        
        StudySession.objects.create(task=task)
        task.status = 'IN_PROGRESS'
        task.save()
        return Response({'status': 'session started', 'task_status': task.status})

    @action(detail=True, methods=['post'])
    def stop_session(self, request, pk=None):
        task = self.get_object()
        session = StudySession.objects.filter(task=task, ended_at__isnull=True).last()
        if session:
            session.ended_at = timezone.now()
            delta = session.ended_at - session.started_at
            session.duration_minutes = int(delta.total_seconds() / 60)
            session.notes = request.data.get('notes', '')
            session.save()
            
            # Update task actual duration
            total_duration = sum([s.duration_minutes for s in task.sessions.filter(ended_at__isnull=False)])
            task.actual_duration = timezone.timedelta(minutes=total_duration)
            task.save()
            
            return Response({'status': 'session stopped', 'duration': session.duration_minutes})
        return Response({'error': 'no active session found'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def suggestions(self, request):
        tasks = Task.objects.filter(user=request.user, status__in=['TODO', 'IN_PROGRESS']).order_by('-auto_priority_score')
        
        focus_task = tasks.first()
        today_plan = tasks[:5]
        overdue_alerts = tasks.filter(due_date__lt=timezone.now()).exclude(status='DONE')
        quick_wins = tasks.filter(estimated_duration__lte=timezone.timedelta(minutes=30)).order_by('-auto_priority_score')[:3]
        
        # Simple tip logic
        tip = "Commence par ta tâche la plus prioritaire pour libérer ton esprit."
        if overdue_alerts.count() > 0:
            tip = f"Tu as {overdue_alerts.count()} tâches en retard. Occupe-toi en rapidement !"
        elif focus_task and focus_task.category == 'EXAMEN':
            tip = f"Ton examen {focus_task.title} approche. C'est le moment de réviser."

        return Response({
            "focus_task": TaskSerializer(focus_task).data if focus_task else None,
            "today_plan": TaskSerializer(today_plan, many=True).data,
            "overdue_alerts": TaskSerializer(overdue_alerts, many=True).data,
            "quick_wins": TaskSerializer(quick_wins, many=True).data,
            "tip": tip
        })
