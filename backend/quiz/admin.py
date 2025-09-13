from django.contrib import admin
from .models import QuizSpreadsheet, QuizQuestion, UserQuizProgress
import pandas as pd

@admin.register(QuizSpreadsheet)
class QuizSpreadsheetAdmin(admin.ModelAdmin):
    list_display = ['name', 'uploaded_at', 'is_active']
    list_filter = ['is_active', 'uploaded_at']
    actions = ['make_active', 'process_spreadsheet']

    def make_active(self, request, queryset):
        QuizSpreadsheet.objects.all().update(is_active=False)
        queryset.update(is_active=True)
        self.message_user(request, "Selected spreadsheet is now active")
    make_active.short_description = "Set as active spreadsheet"

    def process_spreadsheet(self, request, queryset):
        for spreadsheet in queryset:
            try:
                df = pd.read_excel(spreadsheet.file.path)
                QuizQuestion.objects.filter(spreadsheet=spreadsheet).delete()
                
                for _, row in df.iterrows():
                    QuizQuestion.objects.create(
                        spreadsheet=spreadsheet,
                        roll_number=str(row['roll_number']),
                        question_1=str(row['question_1']),
                        answer_1=str(row['answer_1']),
                        roll_display_1=str(row['roll_display_1']),
                        question_2=str(row['question_2']),
                        answer_2=str(row['answer_2']),
                        roll_display_2=str(row['roll_display_2']),
                        question_3=str(row['question_3']),
                        answer_3=str(row['answer_3']),
                        roll_display_3=str(row['roll_display_3']),
                    )
                self.message_user(request, f"Processed {len(df)} questions from {spreadsheet.name}")
            except Exception as e:
                self.message_user(request, f"Error processing {spreadsheet.name}: {str(e)}", level='ERROR')
    process_spreadsheet.short_description = "Process spreadsheet data"

@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ['roll_number', 'spreadsheet']
    list_filter = ['spreadsheet']
    search_fields = ['roll_number']

@admin.register(UserQuizProgress)
class UserQuizProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'roll_number', 'current_question', 'completed', 'last_activity']
    list_filter = ['completed', 'current_question']
    search_fields = ['user__username', 'roll_number']