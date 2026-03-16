from rest_framework.permissions import BasePermission

class IsSeller(BasePermission):
    """
    Custom permission to check if user is a seller.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'seller')

class IsAdmin(BasePermission):
    """
    Custom permission to check if user is an admin.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')
