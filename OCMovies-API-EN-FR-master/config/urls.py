"""OCMovies-API URL Configuration
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('OCMovies-API-EN-FR-master/v1/genres/', include('OCMovies-API-EN-FR-master.v1.genres.urls')),
    path('OCMovies-API-EN-FR-master/v1/titles/', include('OCMovies-API-EN-FR-master.v1.titles.urls')),
]
