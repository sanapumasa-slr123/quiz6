from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializers import OrderSerializer

class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        data = request.data.copy()
        data['buyer'] = request.user.id
        
        # Check for duplicate transaction ID
        if Order.objects.filter(paypal_transaction_id=data.get('paypal_transaction_id')).exists():
            return Response(
                {'detail': 'This transaction has already been processed.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = OrderSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save(buyer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserOrderHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        orders = Order.objects.filter(buyer=request.user)
        serializer = OrderSerializer(orders, many=True, context={'request': request})
        return Response(serializer.data)
