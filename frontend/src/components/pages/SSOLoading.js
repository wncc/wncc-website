import React, { useEffect, useRef } from 'react';
import { getCSRFToken, fetchCSRFToken } from '../../utils/csrf';

const SSOLoading = () => {
    const hasRun = useRef(false);
    
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        
        const handleSSOCallback = async () => {
            const params = new URLSearchParams(window.location.search);
            let accessid = params.get('accessid') || params.get('sessionkey');
            
            // If not in URL, check localStorage
            if (!accessid) {
                accessid = localStorage.getItem('accessid');
            } else {
                // Store in localStorage for future use
                localStorage.setItem('accessid', accessid);
            }
            
            if (!accessid) {
                alert('No access ID found');
                window.location.href = '/';
                return;
            }

            try {
                const csrfToken = getCSRFToken() || await fetchCSRFToken();
                
                const response = await fetch('http://localhost:8000/api/auth/get-sso-user/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                    credentials: 'include',
                    body: JSON.stringify({ sessionkey: accessid })
                });

                const data = await response.json();
                
                if (response.ok) {
                    localStorage.removeItem('accessid');
                    window.location.href = '/';
                } else {
                    alert(`SSO Login failed: ${data.error || 'Unknown error'}`);
                    window.location.href = '/';
                }
            } catch (error) {
                alert('Network error during login');
                window.location.href = '/';
            }
        };

        handleSSOCallback();
    }, []);

    return (
        <div className="flex items-center justify-center h-screen flex-col">
            <p className="text-lg text-gray-700">Logging you in via SSO...</p>
        </div>
    );
};

export default SSOLoading;