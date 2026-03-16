from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from uuid import uuid4
from .models import SellerApplication
from .serializers import SellerApplicationSerializer
from users.models import CustomUser

class SubmitApplicationView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        # Check if user already has an application
        if hasattr(request.user, 'seller_application'):
            return Response(
                {'detail': 'You have already submitted an application.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        app = SellerApplication.objects.create(user=request.user)
        serializer = SellerApplicationSerializer(app)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ListApplicationView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'admin':
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        applications = SellerApplication.objects.all()
        serializer = SellerApplicationSerializer(applications, many=True)
        return Response(serializer.data)

class ApproveApplicationView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        if request.user.role != 'admin':
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            app = SellerApplication.objects.get(pk=pk)
        except SellerApplication.DoesNotExist:
            return Response({'detail': 'Application not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        app.status = 'approved'
        app.user.role = 'seller'
        app.user.merchant_id = uuid4().hex[:12].upper()
        app.user.save()
        app.save()
        
        serializer = SellerApplicationSerializer(app)
        return Response(serializer.data)

class DeclineApplicationView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        if request.user.role != 'admin':
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            app = SellerApplication.objects.get(pk=pk)
        except SellerApplication.DoesNotExist:
            return Response({'detail': 'Application not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        app.status = 'declined'
        app.decline_reason = request.data.get('decline_reason', '')
        app.save()
        
        serializer = SellerApplicationSerializer(app)
        return Response(serializer.data)
