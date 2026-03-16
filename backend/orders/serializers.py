from rest_framework import serializers
from .models import Order
from services.serializers import ServiceSerializer

class OrderSerializer(serializers.ModelSerializer):
    service_details = ServiceSerializer(source='service', read_only=True)
    
    class Meta:
        model = Order
        fields = ('id', 'buyer', 'service', 'service_details', 'paypal_transaction_id', 'price_paid', 'date_purchased')
        read_only_fields = ('id', 'buyer', 'date_purchased')
