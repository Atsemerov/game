from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from .forms import CustomUserCreationForm, CustomLoginForm
from django.contrib.auth import login, authenticate
from rest_framework import viewsets
#from django_filters.rest_framework import DjangoFilterBackend
from .models import CustomUser
from .serializers import UsersSerializer

#def home(request):
 #   return render(request, "home.html")


def registration(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST) # указываем созданную нами форму из forms.py
        if form.is_valid():
            user = form.save(commit=False)
            user.score = form.cleaned_data['score'] # подставляется результат валидации score из forms.py
            user.save()
            return redirect('login')
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})


def custom_login(request):
    if request.method == 'POST':
        form = CustomLoginForm(request, data=request.POST) # указываем созданную нами форму из forms.py
        if form.is_valid():
            user = form.get_user()
            login(request, user)

            # обновим очки
            score = form.cleaned_data['score'] # подставляется результат валидации score из forms.py
            if score > user.score: # если новый результат лучше прошлого, то обновляем результат в БД
                user.score = score
                user.save()

            return redirect('game')
    else:
        form = CustomLoginForm()
    return render(request, 'registration/login.html', {'form': form})

class UsersViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UsersSerializer

def game_view(request):
    return render(request, 'index.html')