from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Service
from .serializers import ServiceSerializer

class ServiceListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True, context={'request': request})
        return Response(serializer.data)

class ServiceDetailView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        try:
            service = Service.objects.get(pk=pk)
        except Service.DoesNotExist:
            return Response({'detail': 'Service not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ServiceSerializer(service, context={'request': request})
        return Response(serializer.data)

class SellerServiceManageView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'seller':
            return Response({'detail': 'Only sellers can manage services.'}, status=status.HTTP_403_FORBIDDEN)
        
        services = Service.objects.filter(seller=request.user)
        serializer = ServiceSerializer(services, many=True, context={'request': request})
        return Response(serializer.data)
    
    def post(self, request):
        if request.user.role != 'seller':
            return Response({'detail': 'Only sellers can create services.'}, status=status.HTTP_403_FORBIDDEN)
        
        data = request.data.copy()
        data['seller'] = request.user.id
        serializer = ServiceSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save(seller=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SellerServiceDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_service_object(self, pk, user):
        try:
            service = Service.objects.get(pk=pk)
            if service.seller != user:
                return None
            return service
        except Service.DoesNotExist:
            return None
    
    def get(self, request, pk):
        if request.user.role != 'seller':
            return Response({'detail': 'Only sellers can view their services.'}, status=status.HTTP_403_FORBIDDEN)
        
        service = self.get_service_object(pk, request.user)
        if not service:
            return Response({'detail': 'Service not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ServiceSerializer(service, context={'request': request})
        return Response(serializer.data)
    
    def put(self, request, pk):
        if request.user.role != 'seller':
            return Response({'detail': 'Only sellers can update their services.'}, status=status.HTTP_403_FORBIDDEN)
        
        service = self.get_service_object(pk, request.user)
        if not service:
            return Response({'detail': 'Service not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ServiceSerializer(service, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        if request.user.role != 'seller':
            return Response({'detail': 'Only sellers can delete their services.'}, status=status.HTTP_403_FORBIDDEN)
        
        service = self.get_service_object(pk, request.user)
        if not service:
            return Response({'detail': 'Service not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
