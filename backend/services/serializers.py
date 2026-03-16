from rest_framework import serializers
from .models import Service

class ServiceSerializer(serializers.ModelSerializer):
    seller_name = serializers.SerializerMethodField()
    sample_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Service
        fields = ('id', 'seller', 'seller_name', 'service_name', 'description', 'price', 'duration_of_service', 'sample_image', 'rating', 'created_at')
        read_only_fields = ('id', 'created_at')
    
    def get_seller_name(self, obj):
        return f"{obj.seller.first_name} {obj.seller.last_name}".strip() or obj.seller.email
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if instance.sample_image:
            if request and request.build_absolute_uri('/').endswith('/'):
                base_url = request.build_absolute_uri('/')[:-1]
            else:
                base_url = 'http://localhost:8000'
            data['sample_image'] = f"{base_url}{instance.sample_image.url}"
        return data
