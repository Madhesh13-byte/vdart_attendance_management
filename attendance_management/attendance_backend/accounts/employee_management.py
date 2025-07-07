from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_organization_employees(request):
    """Get all employees for the admin's organization"""
    if request.user.role != 'admin':
        return Response({'error': 'Only admins can view employees'}, status=status.HTTP_403_FORBIDDEN)
    
    if not request.user.organization:
        return Response({'error': 'Admin not assigned to organization'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get all employees in the same organization
    employees = User.objects.filter(
        organization=request.user.organization,
        role='employee'
    ).select_related('organization')
    
    serializer = UserSerializer(employees, many=True)
    return Response({
        'employees': serializer.data,
        'organization': request.user.organization.name,
        'count': employees.count()
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_organization_employee(request):
    """Create employee for admin's organization"""
    if request.user.role != 'admin':
        return Response({'error': 'Only admins can create employees'}, status=status.HTTP_403_FORBIDDEN)
    
    if not request.user.organization:
        return Response({'error': 'Admin not assigned to organization'}, status=status.HTTP_400_BAD_REQUEST)
    
    data = request.data.copy()
    data['role'] = 'employee'
    
    # Create user
    try:
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            employee_id=data.get('employee_id', ''),
            project=data.get('project', ''),
            designation=data.get('designation', ''),
            date_joined_company=data.get('date_joined_company') or None,
            organization=request.user.organization,
            role='employee'
        )
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = UserSerializer(user)
    return Response({
        'employee': serializer.data,
        'message': 'Employee created successfully'
    }, status=status.HTTP_201_CREATED)