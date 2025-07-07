from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from .employee_management import get_organization_employees, create_organization_employee

urlpatterns = [
    path('login/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('create-user/', views.UserCreateView.as_view(), name='create_user'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('profile/update/', views.ProfileUpdateView.as_view(), name='profile_update'),
    path('users/', views.user_list, name='user_list'),
    path('employees/', get_organization_employees, name='organization_employees'),
    path('employees/create/', create_organization_employee, name='create_organization_employee'),
    path('change-password/', views.change_password, name='change_password'),
]