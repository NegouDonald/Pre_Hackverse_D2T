from django.urls import path
from .views import DashboardStatsView, ProductivityGraphView, CategoryStatsView, HeatmapDataView

urlpatterns = [
    path('dashboard/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('productivity/', ProductivityGraphView.as_view(), name='productivity'),
    path('category_stats/', CategoryStatsView.as_view(), name='category-stats'),
    path('heatmap/', HeatmapDataView.as_view(), name='heatmap'),
]
