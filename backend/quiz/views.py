from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import QuizSpreadsheet, QuizQuestion, UserQuizProgress
import json

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_quiz_status(request):
    try:
        progress = UserQuizProgress.objects.get(user=request.user)
        return Response({
            'has_progress': True,
            'current_question': progress.current_question,
            'completed': progress.completed,
            'roll_number': progress.roll_number
        })
    except UserQuizProgress.DoesNotExist:
        return Response({'has_progress': False})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_quiz(request):
    # Get roll number from authenticated user's profile
    try:
        from authentication.models import UserProfile
        profile = UserProfile.objects.get(user=request.user)
        roll_number = profile.roll_number.replace(' ', '').lower()
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        active_spreadsheet = QuizSpreadsheet.objects.get(is_active=True)
        # Ensure we query with normalized roll number
        quiz_questions = QuizQuestion.objects.get(
            spreadsheet=active_spreadsheet,
            roll_number__iexact=roll_number.replace(' ', '').lower()
        )
        
        progress, created = UserQuizProgress.objects.get_or_create(
            user=request.user,
            defaults={'roll_number': roll_number}
        )
        
        if progress.completed:
            return Response({'error': 'Quiz already completed'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'message': 'Quiz started',
            'current_question': progress.current_question
        })
        
    except QuizSpreadsheet.DoesNotExist:
        return Response({'error': 'No active quiz available'}, status=status.HTTP_404_NOT_FOUND)
    except QuizQuestion.DoesNotExist:
        return Response({'error': 'Roll number not found in quiz data'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_question(request):
    try:
        progress = UserQuizProgress.objects.get(user=request.user)
        active_spreadsheet = QuizSpreadsheet.objects.get(is_active=True)
        quiz_questions = QuizQuestion.objects.get(
            spreadsheet=active_spreadsheet,
            roll_number__iexact=progress.roll_number.replace(' ', '').lower()
        )
        
        if progress.completed:
            return Response({'error': 'Quiz already completed'}, status=status.HTTP_400_BAD_REQUEST)
        
        question_field = f'question_{progress.current_question}'
        question_text = getattr(quiz_questions, question_field)
        
        return Response({
            'question_number': progress.current_question,
            'question': question_text,
            'total_questions': 3
        })
        
    except (UserQuizProgress.DoesNotExist, QuizSpreadsheet.DoesNotExist, QuizQuestion.DoesNotExist):
        return Response({'error': 'Quiz not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_answer(request):
    answer = request.data.get('answer', '').strip()
    
    try:
        progress = UserQuizProgress.objects.get(user=request.user)
        active_spreadsheet = QuizSpreadsheet.objects.get(is_active=True)
        quiz_questions = QuizQuestion.objects.get(
            spreadsheet=active_spreadsheet,
            roll_number__iexact=progress.roll_number.replace(' ', '').lower()
        )
        
        if progress.completed:
            return Response({'error': 'Quiz already completed'}, status=status.HTTP_400_BAD_REQUEST)
        
        answer_field = f'answer_{progress.current_question}'
        roll_display_field = f'roll_display_{progress.current_question}'
        
        correct_answer = getattr(quiz_questions, answer_field)
        roll_display = getattr(quiz_questions, roll_display_field)
        
        # Normalize both answers by removing spaces and converting to lowercase
        normalized_user_answer = answer.replace(' ', '').lower()
        normalized_correct_answer = correct_answer.replace(' ', '').lower()
        
        is_correct = normalized_user_answer == normalized_correct_answer
        
        if is_correct:
            if progress.current_question < 3:
                progress.current_question += 1
                progress.save()
                return Response({
                    'correct': True,
                    'roll_number': roll_display,
                    'next_question': progress.current_question <= 3
                })
            else:
                progress.completed = True
                progress.save()
                return Response({
                    'correct': True,
                    'roll_number': roll_display,
                    'quiz_completed': True
                })
        else:
            return Response({
                'correct': False,
                'message': 'Incorrect answer. Try again.'
            })
            
    except (UserQuizProgress.DoesNotExist, QuizSpreadsheet.DoesNotExist, QuizQuestion.DoesNotExist):
        return Response({'error': 'Quiz not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_collected_rolls(request):
    try:
        progress = UserQuizProgress.objects.get(user=request.user)
        if not progress.completed:
            return Response({'error': 'Quiz not completed yet'}, status=status.HTTP_400_BAD_REQUEST)
            
        active_spreadsheet = QuizSpreadsheet.objects.get(is_active=True)
        quiz_questions = QuizQuestion.objects.get(
            spreadsheet=active_spreadsheet,
            roll_number__iexact=progress.roll_number.replace(' ', '').lower()
        )
        
        # Get all roll display numbers for completed questions
        rolls = []
        for i in range(1, 4):  # Questions 1, 2, 3
            roll_display_field = f'roll_display_{i}'
            roll_display = getattr(quiz_questions, roll_display_field)
            rolls.append(roll_display)
            
        return Response({'rolls': rolls})
        
    except (UserQuizProgress.DoesNotExist, QuizSpreadsheet.DoesNotExist, QuizQuestion.DoesNotExist):
        return Response({'error': 'Quiz data not found'}, status=status.HTTP_404_NOT_FOUND)