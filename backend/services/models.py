from django.db import models
from django.core.validators import MinValueValidator
from users.models import CustomUser

class Service(models.Model):
    seller = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='services')
    service_name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    duration_of_service = models.CharField(max_length=100)
    sample_image = models.ImageField(upload_to='services/')
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0, validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.service_name
    
    class Meta:
        verbose_name = 'Service'
        verbose_name_plural = 'Services'
        ordering = ['-created_at']
