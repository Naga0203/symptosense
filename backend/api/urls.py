from django.urls import path
from .views.views import (
    health_check,
    prediction_view,
    ai_agent_view,
    ai_workflow_view,
    firebase_data_view,
)
from .views.auth_views import (
    register_user,
    sync_user,
    profile_view,
)
from .views.assessment_views import (
    ocr_extract_view,
    diagnosis_view,
    get_assessment_history,
    report_insight_view,
    list_diseases_view,
)

urlpatterns = [
    path('health/', health_check, name='health_check'),
    path('predictions/', prediction_view, name='predictions'),
    path('ai/agents/', ai_agent_view, name='ai_agents'),
    path('ai/workflows/', ai_workflow_view, name='ai_workflows'),
    path('firebase/<str:collection>/', firebase_data_view, name='firebase_data'),
    path('auth/register/', register_user, name='register'),
    path('auth/sync/', sync_user, name='sync'),
    path('auth/profile/', profile_view, name='profile'),
    path('assessment/extract/', ocr_extract_view, name='ocr_extract'),
    path('assessment/diagnose/', diagnosis_view, name='diagnose'),
    path('assessment/history/', get_assessment_history, name='assessment_history'),
    path('assessment/insight/', report_insight_view, name='report_insight'),
    path('assessment/diseases/', list_diseases_view, name='list_diseases'),
]
