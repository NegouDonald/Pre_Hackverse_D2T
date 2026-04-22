from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Count, Sum, F
from django.utils import timezone
from tasks.models import Task, StudySession
from django.db.models.functions import TruncDay

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        tasks = Task.objects.filter(user=user)
        
        total_tasks = tasks.count()
        completed_tasks = tasks.filter(status='DONE').count()
        completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        
        # Tasks due today
        today = timezone.now().date()
        due_today = tasks.filter(due_date__date=today).count()
        
        # Time spent today
        time_today = StudySession.objects.filter(
            task__user=user, 
            started_at__date=today
        ).aggregate(total_min=Sum('duration_minutes'))['total_min'] or 0

        return Response({
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "completion_rate": round(completion_rate, 1),
            "due_today": due_today,
            "time_spent_today_minutes": time_today
        })

class ProductivityGraphView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Last 7 days productivity
        seven_days_ago = timezone.now() - timezone.timedelta(days=7)
        stats = Task.objects.filter(
            user=request.user, 
            status='DONE',
            updated_at__gte=seven_days_ago
        ).annotate(day=TruncDay('updated_at')) \
         .values('day') \
         .annotate(count=Count('id')) \
         .order_by('day')
        
        return Response(stats)

class CategoryStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        stats = Task.objects.filter(user=request.user) \
            .values('category') \
            .annotate(count=Count('id'))
        return Response(stats)

class HeatmapDataView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Count of completed tasks per day for heatmap
        stats = Task.objects.filter(user=request.user, status='DONE') \
            .annotate(date=TruncDay('updated_at')) \
            .values('date') \
            .annotate(value=Count('id'))
        return Response(stats)
