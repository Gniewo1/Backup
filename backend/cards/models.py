from django.db import models

# Create your models here.

class Card(models.Model):
    name = models.CharField(max_length=100) 
    image = models.ImageField(upload_to='card_images/')  

    def __str__(self):
        return self.name