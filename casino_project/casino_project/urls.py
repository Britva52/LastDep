from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from casino import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('roulette/', include('casino.urls')),
    path('', views.index, name='index'),
    path('index/', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('support/', views.support, name='support'),
    path('contacts/', views.contacts, name='contacts'),
    path('games/', views.games, name='games'),
    path('accounts/', include('django.contrib.auth.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)