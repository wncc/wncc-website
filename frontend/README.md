# WnCC Website - Frontend

React frontend for the WnCC Website with modern UI and SSO integration.

## 🚀 Features

- **Modern React 19** with hooks and functional components
- **Tailwind CSS** for responsive styling
- **Framer Motion** for smooth animations
- **ITC SSO Integration** for secure authentication
- **Interactive Quiz Interface** with progress tracking
- **Responsive Design** optimized for all devices

## 🛠️ Tech Stack

- **React 19.0.0** - UI framework
- **React Router DOM 7.9.1** - Client-side routing
- **Tailwind CSS 3.4.17** - Utility-first CSS
- **Framer Motion 11.15.0** - Animation library
- **Axios 1.7.9** - HTTP client
- **Lucide React** - Icon library

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── common/           # Reusable components
│   │   ├── Card.js
│   │   ├── ParticleEffect.js
│   │   └── TechNewsFeed.js
│   ├── layout/           # Layout components
│   │   ├── Footer.js
│   │   └── Navbar.js
│   ├── pages/            # Page components
│   │   ├── HelloFOSS.js
│   │   ├── Quiz.js
│   │   └── SSOLoading.js
│   ├── store.js          # State management
│   └── WnCCWebsite.js    # Main website component
├── styles/
│   └── tailwind.css      # Tailwind imports
├── utils/
│   ├── csrf.js           # CSRF token handling
│   └── helpers.js        # Utility functions
└── App.js                # Root component
```

## 🔧 Configuration

### Environment Setup
The app uses legacy OpenSSL provider for compatibility:
```json
{
  "scripts": {
    "start": "set NODE_OPTIONS=--openssl-legacy-provider && react-scripts start",
    "build": "set NODE_OPTIONS=--openssl-legacy-provider && react-scripts build"
  }
}
```

### Tailwind Configuration
Custom configuration in `tailwind.config.js` with animations and custom utilities.

## 🎯 Key Components

### Quiz Component
- Multi-round quiz interface
- Progress tracking
- Roll number display
- Session persistence

### SSO Loading
- Handles ITC SSO callback
- Processes authentication tokens
- Redirects after successful login

### Navbar
- Dynamic authentication state
- Conditional quiz link display
- Responsive mobile menu

## 🔐 Authentication Flow

1. User clicks "Login with ITC SSO"
2. Redirected to SSO provider
3. Returns to `/loading` with access token
4. Token processed and user authenticated
5. Quiz functionality becomes available

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Custom animations** with Tailwind Animate
- **Responsive design** with mobile-first approach
- **Dark/light theme** support

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint optimization
- Touch-friendly interfaces
- Optimized performance

## 🚀 Development

```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Analyze bundle
npm run build && npx serve -s build
```

## 🔗 API Integration

The frontend communicates with the Django backend via:
- Authentication endpoints
- Quiz management APIs
- User progress tracking
- Session management

## 📦 Build & Deployment

### Development
```bash
npm start  # Runs on http://localhost:3000
```

### Production
```bash
npm run build  # Creates optimized build/
```

## 🐛 Troubleshooting

### Common Issues
- **OpenSSL Legacy Provider**: Already configured in package.json
- **CORS Issues**: Ensure backend CORS settings allow frontend origin
- **Build Failures**: Check Node.js version compatibility

### Performance
- Code splitting implemented
- Lazy loading for components
- Optimized bundle size
- Image optimization

## 🤝 Contributing

1. Follow React best practices
2. Use functional components with hooks
3. Maintain consistent styling with Tailwind
4. Test responsive design
5. Ensure accessibility compliance

---

Built with React and Tailwind CSS for WnCC Hello FOSS 2025
