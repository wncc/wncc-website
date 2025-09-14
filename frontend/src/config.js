const config = {
    apiUrl: process.env.REACT_APP_API_URL || 'https://wnccb.tech-iitb.org',
    websiteUrl: process.env.REACT_APP_WEBSITE_URL || 'https://wncc.tech-iitb.org',
    ssoRedirectUrl: process.env.REACT_APP_SSO_REDIRECT_URL || 'https://wncc.tech-iitb.org/loading',
    env: process.env.NODE_ENV || 'development',
};

export default config;