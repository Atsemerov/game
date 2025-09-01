from django.contrib import admin

# Register your models here.
from .models import CustomUser
@admin.register(CustomUser)  # Регистрируем модель в админке
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'score', 'level', 'is_active')  # Какие поля показывать в списке
    search_fields = ('username',)  # Добавляем поиск по имени пользователя
    list_filter = ('is_active', 'level')  # Фильтры по активности и уровню