from rest_framework import serializers
from .models import SellerApplication
from users.serializers import UserSerializer

class SellerApplicationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = SellerApplication
        fields = ('id', 'user', 'status', 'decline_reason', 'created_at')
        read_only_fields = ('id', 'user', 'created_at')
