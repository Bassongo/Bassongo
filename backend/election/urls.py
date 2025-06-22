from django.urls import path
from . import views

app_name = 'election'

urlpatterns = [
    path('', views.election_list, name='list'),
    path('<int:pk>/', views.election_detail, name='detail'),
    path('<int:pk>/results/', views.election_results, name='results'),
]
