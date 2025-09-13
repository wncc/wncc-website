# WnCC Website 

A full-stack web application for WnCC website featuring SSO authentication and interactive quiz functionality.

## 🚀 Project Overview

This platform provides:
- **ITC SSO Authentication** - Secure login integration
- **Interactive Quiz System** - Multi-round quiz with progress tracking
- **Admin Dashboard** - Easy quiz management via spreadsheet uploads
- **Responsive Design** - Modern UI with Tailwind CSS and Framer Motion

## 🏗️ Architecture

```
Hello Foss/
├── backend/           # Django REST API
├── WnCC-Website/      # React Frontend
└── README.md         # This file
```

## 🛠️ Tech Stack

### Backend
- **Django 5.2.6** - Web framework
- **Django REST Framework** - API development
- **SQLite** - Database (development)
- **Pandas & OpenPyXL** - Excel processing

### Frontend
- **React 19** - UI framework
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Router** - Navigation

## ⚡ Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 2. Frontend Setup
```bash
cd WnCC-Website
npm install
npm start
```

### 3. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:8000/admin

## 📋 Features

### For Users
- Single Sign-On with ITC SSO
- Interactive quiz with 3 rounds
- Progress tracking and resume capability
- Roll number display after correct answers
- Responsive mobile-friendly interface

### For Admins
- Excel spreadsheet upload for quiz data
- User progress monitoring
- Quiz session management
- Bulk quiz processing

## 🚀 Deployment

### Development
Both frontend and backend run locally with hot reload enabled.

### Production
- Configure environment variables
- Set up proper database (PostgreSQL recommended)
- Build React app for production
- Deploy with proper web server (nginx + gunicorn)

## 📚 Documentation

- [Frontend README](./WnCC-Website/README.md) - React app details
- [Backend README](./backend/README.md) - Django API documentation
- [Setup Guide](./SETUP_GUIDE.md) - Detailed setup instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of WnCC's Hello FOSS initiative.

## 🆘 Support

For issues and questions:
- Check existing documentation
- Review setup guides
- Contact the WnCC team

---

Built with ❤️ by the WnCC Team 