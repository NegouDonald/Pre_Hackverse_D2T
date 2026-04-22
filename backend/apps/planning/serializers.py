from rest_framework import serializers
from .models import TimeSlot
from tasks.serializers import TaskSerializer

class TimeSlotSerializer(serializers.ModelSerializer):
    task_details = TaskSerializer(source='task', read_only=True)
    
    class Meta:
        model = TimeSlot
        fields = ('id', 'task', 'task_details', 'title', 'start_time', 'end_time', 'slot_type', 'is_auto_generated')
        read_only_fields = ('id',)
