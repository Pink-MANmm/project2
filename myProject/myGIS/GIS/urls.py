from unicodedata import name
from django.urls import path  # 导入路径相关配置
from . import views  # 导入视图views

urlpatterns = [
    path('', views.login, name='login'),
    path('main/', views.main, name='main'),
    path('get/', views.get, name='get'),
    path('add/', views.add, name='add'),
    path('delete/', views.delete, name='delete'),
    path('register/', views.register, name='register')
]

