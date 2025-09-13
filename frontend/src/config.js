const config = {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    websiteUrl: process.env.REACT_APP_WEBSITE_URL || 'http://localhost:3000',
    ssoRedirectUrl: process.env.REACT_APP_SSO_REDIRECT_URL || 'http://localhost:3000/loading',
    env: process.env.NODE_ENV || 'development',
};

export default config;