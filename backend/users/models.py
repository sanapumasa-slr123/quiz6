from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('seller', 'Seller'),
        ('admin', 'Admin'),
    )
    
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True)
    location = models.CharField(max_length=255, blank=True)
    gender = models.CharField(max_length=10, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    merchant_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email
    
    class Meta:
        verbose_name = 'Custom User'
        verbose_name_plural = 'Custom Users'
