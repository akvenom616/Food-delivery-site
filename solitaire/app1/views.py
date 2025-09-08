from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib import messages
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required

def front_view(request):
    return render(request, 'front.html')

def signup_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        print("Received username:", username)

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists!")
        else:
            User.objects.create_user(username=username, email=email, password=password)
            messages.success(request, "Account created! Please log in.")
            return redirect('login')
    return render(request, 'signup.html')

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        try:
            user_obj = User.objects.get(email=email)
            username = user_obj.username
        except User.DoesNotExist:
            username = None
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            return redirect('home')
        else:
            messages.error(request, "Invalid email or password.")
    return render(request, 'login.html')


@login_required
def home_view(request):
    return render(request, 'home.html')

def aboutus_view(request):
    return render(request, 'aboutus.html')

def feedback_view(request):
    return render(request, 'feedback.html')

def details_view(request):
    return render(request, 'details.html')

def checkout_view(request):
    return render(request, 'checkout.html')

