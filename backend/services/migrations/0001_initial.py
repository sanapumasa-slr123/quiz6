from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.core.validators

class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('service_name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ('duration_of_service', models.CharField(max_length=100)),
                ('sample_image', models.ImageField(upload_to='services/')),
                ('rating', models.DecimalField(decimal_places=2, default=0.0, max_digits=3, validators=[django.core.validators.MinValueValidator(0)])),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('seller', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='services', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Service',
                'verbose_name_plural': 'Services',
                'ordering': ['-created_at'],
            },
        ),
    ]
