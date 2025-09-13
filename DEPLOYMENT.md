# WnCC Website Deployment Guide

## Overview
This guide covers deployment of the WnCC website using Docker containers for both frontend and backend services.

## Prerequisites
- Docker and Docker Compose installed
- Git (for cloning the repository)

## Quick Start with Docker Compose

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd "WnCC Backend+Frontend"
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
# Database Configuration
POSTGRES_DB=wncc_db
POSTGRES_USER=wncc_user
POSTGRES_PASSWORD=wncc_password

# Django Configuration
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com
SECRET_KEY=your-secret-key-here
```

### 3. Deploy with Docker Compose
```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Database: localhost:5432

## Individual Service Deployment

### Frontend Deployment
```bash
cd frontend

# Build Docker image
docker build -t wncc-frontend .

# Run container
docker run -d -p 3000:80 --name wncc-frontend wncc-frontend
```

### Backend Deployment
```bash
cd backend

# Build Docker image
docker build -t wncc-backend .

# Run container (requires database)
docker run -d -p 8000:8000 --name wncc-backend \
  -e DEBUG=False \
  -e ALLOWED_HOSTS=localhost,127.0.0.1 \
  wncc-backend
```

## Production Deployment

### 1. Update Environment Variables
```env
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
SECRET_KEY=your-production-secret-key
DATABASE_URL=postgresql://user:password@db:5432/wncc_db
```

### 2. Use Production Database
Replace SQLite with PostgreSQL in production:
```python
# backend/wncc_backend/settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB'),
        'USER': os.environ.get('POSTGRES_USER'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),
        'HOST': 'db',
        'PORT': '5432',
    }
}
```

### 3. SSL and Domain Configuration
Update nginx configuration for HTTPS:
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Development Setup

### Frontend Development
```bash
cd frontend
npm install
npm start  # Runs on http://localhost:3000
```

### Backend Development
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver  # Runs on http://localhost:8000
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :3000
   
   # Kill process if needed
   kill -9 <PID>
   ```

2. **Database Connection Issues**
   ```bash
   # Check database container
   docker-compose logs db
   
   # Connect to database
   docker-compose exec db psql -U wncc_user -d wncc_db
   ```

3. **Frontend Build Issues**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Remove node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Backend Migration Issues**
   ```bash
   # Run migrations manually
   docker-compose exec backend python manage.py migrate
   
   # Create superuser
   docker-compose exec backend python manage.py createsuperuser
   ```

### Logs and Debugging
```bash
# View all service logs
docker-compose logs

# View specific service logs
docker-compose logs frontend
docker-compose logs backend
docker-compose logs db

# Follow logs in real-time
docker-compose logs -f backend
```

## Performance Optimization

### Frontend Optimization
- Enable gzip compression in nginx
- Use CDN for static assets
- Implement service worker for caching

### Backend Optimization
- Use gunicorn with multiple workers
- Implement Redis for caching
- Optimize database queries

### Database Optimization
- Set up connection pooling
- Configure proper indexes
- Regular database maintenance

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive data to version control
   - Use Docker secrets in production
   - Rotate keys regularly

2. **Network Security**
   - Use HTTPS in production
   - Configure proper CORS settings
   - Implement rate limiting

3. **Database Security**
   - Use strong passwords
   - Limit database access
   - Regular security updates

## Monitoring and Maintenance

### Health Checks
```bash
# Check service health
curl http://localhost:3000/health
curl http://localhost:8000/health

# Database health
docker-compose exec db pg_isready
```

### Backup Strategy
```bash
# Database backup
docker-compose exec db pg_dump -U wncc_user wncc_db > backup.sql

# Restore database
docker-compose exec -T db psql -U wncc_user wncc_db < backup.sql
```

## Scaling

### Horizontal Scaling
```yaml
# docker-compose.yml
services:
  backend:
    deploy:
      replicas: 3
  
  frontend:
    deploy:
      replicas: 2
```

### Load Balancing
Use nginx or a cloud load balancer to distribute traffic across multiple instances.

## Support

For deployment issues:
1. Check the logs first
2. Verify environment variables
3. Ensure all services are running
4. Contact the development team

---

Built with ❤️ by the WnCC Team