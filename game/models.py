from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    score = models.IntegerField(verbose_name="Очки", default=0)
    level = models.IntegerField(verbose_name="Уровень", default=1)

    class Meta: #Добавляем метаданные модели
        verbose_name = "Игрок"  #Название модели в единственном числе
        verbose_name_plural = "Игроки"  #Название во множественном числе