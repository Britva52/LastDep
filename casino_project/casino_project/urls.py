from django.contrib import admin
from django.urls import path, include
from casino import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('roulette/', include('casino.urls')),
    path('', views.home, name='index'),
    path('index/', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('support/', views.support, name='support'),
    path('contacts/', views.contacts, name='contacts'),
    path('games/', views.games, name='games'),
    path('admin/', admin.site.urls),
]