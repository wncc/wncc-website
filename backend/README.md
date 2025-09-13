# WnCC Website Backend

Django REST API backend for the WnCC Website backend with ITC SSO integration

## 🚀 Features

- **ITC SSO Authentication** - Secure single sign-on integration
- **Excel Quiz Management** - Upload and process quiz data via spreadsheets
- **Progress Tracking** - Resume interrupted quiz sessions
- **Admin Dashboard** - Django admin for quiz management
- **RESTful API** - Clean API endpoints for frontend integration
- **Session Management** - Secure user session handling

## 🛠️ Tech Stack

- **Django 5.2.6** - Web framework
- **Django REST Framework 3.16.0** - API development
- **Django CORS Headers 4.8.0** - Cross-origin resource sharing
- **Pandas 2.2.3** - Data processing
- **OpenPyXL 3.1.5** - Excel file handling
- **SQLite** - Database (development)

## 📦 Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

## 🏗️ Project Structure

```
backend/
├── wncc_backend/          # Django project settings
│   ├── settings.py        # Configuration
│   ├── urls.py           # URL routing
│   └── wsgi.py           # WSGI config
├── authentication/        # SSO authentication app
│   ├── models.py         # User profile models
│   ├── views.py          # Auth API views
│   └── urls.py           # Auth endpoints
├── quiz/                 # Quiz management app
│   ├── models.py         # Quiz data models
│   ├── views.py          # Quiz API views
│   ├── admin.py          # Admin interface
│   └── urls.py           # Quiz endpoints
├── media/                # Uploaded files
├── sample_quiz_data.xlsx # Example format
└── requirements.txt      # Dependencies
```

## 🚀 Development

### Running Tests
```bash
python manage.py test
```

### Database Operations
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Reset database
python manage.py flush
```

### Admin Operations
```bash
# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic
```

## 🌐 Production Deployment

### Environment Variables
```bash
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com
DATABASE_URL=postgresql://user:pass@host:port/db
```

### Database Setup
```python
# settings.py for production
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'wncc_quiz',
        'USER': 'your_user',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### CORS Configuration
```python
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-domain.com",
    "http://localhost:3000",  # Development
]
```

## 🐛 Troubleshooting

### Common Issues

1. **Migration Errors**
   ```bash
   python manage.py migrate --fake-initial
   ```

2. **CORS Issues**
   - Check `CORS_ALLOWED_ORIGINS` in settings
   - Verify frontend URL is included

3. **Excel Processing Errors**
   - Ensure all required columns are present
   - Check for empty cells in critical columns

4. **SSO Authentication Issues**
   - Verify project ID and redirect URLs
   - Check SSO provider configuration

### Debug Mode
```python
# settings.py
DEBUG = True
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
        },
    },
}
```

## 📊 Monitoring

- **Admin Dashboard** - User progress tracking
- **Database Queries** - Monitor quiz completion rates
- **Session Management** - Track active users
- **Error Logging** - Debug authentication issues

---