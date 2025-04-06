from django.shortcuts import render

def home(request):
    print("Страница 'Главная' была вызвана")
    return render(request, 'home.html')


def index(request):
    return render(request, 'index.html')


def about(request):
    print("Страница 'О нас' была вызвана")
    return render(request, 'about.html')


def contacts(request):
    print("Страница 'Контакты' была вызвана")
    return render(request, 'contacts.html')

def support(request):
    print("Страница 'Поддержка' была вызвана")
    return render(request, 'support.html')


def games(request):
    print("Страница 'Игры' была вызвана")
    return render(request, 'games.html')


def roulette(request):
    return render(request, 'casino/roulette.html')