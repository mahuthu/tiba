from rest_framework import serializers

class ChatMessageSerializer(serializers.Serializer):
    question = serializers.CharField(required=True)
    
class ChatResponseSerializer(serializers.Serializer):
    response = serializers.CharField()
    structured_data = serializers.JSONField()
    visualization = serializers.JSONField()
    query_type = serializers.CharField()

class ExampleQuestionsSerializer(serializers.Serializer):
    available_queries = serializers.DictField(
        child=serializers.ListField(
            child=serializers.CharField()
        )
    )
    message = serializers.CharField()