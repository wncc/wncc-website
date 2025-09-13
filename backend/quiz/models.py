from django.db import models
from django.contrib.auth.models import User

class QuizSpreadsheet(models.Model):
    name = models.CharField(max_length=200)
    file = models.FileField(upload_to='quiz_files/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class QuizQuestion(models.Model):
    spreadsheet = models.ForeignKey(QuizSpreadsheet, on_delete=models.CASCADE)
    roll_number = models.CharField(max_length=20)
    question_1 = models.TextField()
    answer_1 = models.TextField()
    roll_display_1 = models.CharField(max_length=20)
    question_2 = models.TextField()
    answer_2 = models.TextField()
    roll_display_2 = models.CharField(max_length=20)
    question_3 = models.TextField()
    answer_3 = models.TextField()
    roll_display_3 = models.CharField(max_length=20)

    def save(self, *args, **kwargs):
        # Normalize roll number
        self.roll_number = self.roll_number.replace(' ', '').lower()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Questions for {self.roll_number}"

class UserQuizProgress(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    roll_number = models.CharField(max_length=20)
    current_question = models.IntegerField(default=1)  # 1, 2, or 3
    completed = models.BooleanField(default=False)
    started_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Normalize roll number
        self.roll_number = self.roll_number.replace(' ', '').lower()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - Question {self.current_question}"