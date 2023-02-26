from django.db import models

# Create your models here.


class positionData(models.Model):
    id = models.IntegerField(primary_key=True, default=0)
    name = models.CharField(max_length=25, default='')
    lon = models.FloatField(default=0)
    lat = models.FloatField(default=0)
    zoom = models.IntegerField(default=0)
