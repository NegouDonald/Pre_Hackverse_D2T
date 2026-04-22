from rest_framework import serializers
from django.utils import timezone
from .models import Task, Tag, StudySession

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name', 'color')

class TaskSerializer(serializers.ModelSerializer):
    auto_priority_score = serializers.ReadOnlyField()
    time_remaining = serializers.SerializerMethodField()
    is_overdue = serializers.SerializerMethodField()
    tags = TagSerializer(many=True, read_only=True)
    estimated_duration_display = serializers.SerializerMethodField()
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Tag.objects.all(),
        write_only=True, source='tags', required=False
    )
    estimated_duration = serializers.DurationField(required=False)
    estimated_duration_minutes = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Task
        fields = (
            'id', 'title', 'description', 'category', 'status', 'priority',
            'auto_priority_score', 'estimated_duration', 'actual_duration',
            'due_date', 'created_at', 'updated_at', 'tags', 'tag_ids',
            'is_recurring', 'recurrence_pattern', 'time_remaining', 'is_overdue',
            'estimated_duration_minutes', 'estimated_duration_display'
        )
        read_only_fields = ('id', 'auto_priority_score', 'created_at', 'updated_at', 'actual_duration')

    def get_estimated_duration_display(self, obj):
        if obj.estimated_duration:
            return int(obj.estimated_duration.total_seconds() / 60)
        return 0

    def get_time_remaining(self, obj):
        if obj.due_date:
            delta = obj.due_date - timezone.now()
            return int(delta.total_seconds() / 60)  # en minutes
        return None

    def get_is_overdue(self, obj):
        return obj.due_date and obj.due_date < timezone.now() and obj.status != 'DONE'

    def _handle_duration(self, validated_data):
        minutes = validated_data.pop('estimated_duration_minutes', None)
        if minutes is not None:
            validated_data['estimated_duration'] = timezone.timedelta(minutes=int(minutes))
        return validated_data

    def create(self, validated_data):
        validated_data = self._handle_duration(validated_data)
        if 'estimated_duration' not in validated_data:
            validated_data['estimated_duration'] = timezone.timedelta(minutes=60)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data = self._handle_duration(validated_data)
        return super().update(instance, validated_data)

class StudySessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudySession
        fields = '__all__'
