import React, { useState, useEffect, useRef } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { getCSRFToken, fetchCSRFToken } from '../../utils/csrf';

const Navbar = ({ currentPage, setCurrentPage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const hasCheckedAuth = useRef(false);

    useEffect(() => {
        if (hasCheckedAuth.current) return;
        hasCheckedAuth.current = true;
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch('https://wnccb.tech-iitb.org/api/auth/status/', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.authenticated) {
                setUser(data.user);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const csrfToken = getCSRFToken() || await fetchCSRFToken();
            await fetch('https://wnccb.tech-iitb.org/api/auth/logout/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include'
            });
            setUser(null);
            if (currentPage === 'Quiz') {
                setCurrentPage('Home');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleLogin = () => {
        const redirect = encodeURIComponent(`${window.location.origin}/loading`);
        const projectId = 'f2ec2cd4-1a8e-465c-aacd-5285979ca72a';
        console.log('Redirecting to SSO with:', `https://sso.tech-iitb.org/project/${projectId}/ssocall/?redirect=${redirect}`);
        window.location.href = `https://sso.tech-iitb.org/project/${projectId}/ssocall/?redirect=${redirect}`;
    };

    // Add "Hello FOSS" to the navItems array
    // const navItems = ["Home", "About", "Events", "Resources", "Blogs", "Team", "Contact", "Hello FOSS"];
    const baseNavItems = ["Home", "Events", "Resources", "Team", "Contact", "Hello FOSS"];
    const navItems = user ? [...baseNavItems, "Quiz"] : baseNavItems;

    const handleNavClick = (page) => {
        setCurrentPage(page);
        setIsOpen(false);
    };

    return (
        <nav className="sticky top-0 bg-gray-900/80 backdrop-blur-lg border-b border-cyan-500/20 px-4 py-4 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <img src="https://wncc.tech-iitb.org/Images/Logo.png" alt="WnCC Logo" className="h-8" />
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-cyan-400">Web & Coding Club</span>
                        <span className="text-xs text-gray-500">IIT Bombay</span>
                    </div>
                    <button
                        className="md:hidden ml-6 text-gray-300 hover:text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Desktop Navbar */}
                <div className="hidden md:flex gap-6 items-center">
                    {navItems.map((item) => (
                        <button
                            key={item}
                            onClick={() => handleNavClick(item)}
                            className={`px-4 py-2 rounded-lg transition-colors duration-300 ${currentPage === item
                                ? "bg-cyan-500/20 text-cyan-400"
                                : "text-gray-300 hover:text-cyan-400"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                    
                    {/* Auth Section */}
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-gray-300 text-sm">
                                Hi, {user.first_name || user.username}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-red-400 transition-colors"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                        >
                            Login with ITC SSO
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Navbar (Hamburger Menu) */}
            {isOpen && (
                <div className="absolute bg-gray-800/90 w-full left-0 top-full flex flex-col gap-4 p-4 border-t border-cyan-500/20">
                    {navItems.map((item) => (
                        <button
                            key={item}
                            onClick={() => handleNavClick(item)}
                            className={`px-4 py-2 rounded-lg transition-colors duration-300 ${currentPage === item
                                ? "bg-cyan-500/20 text-cyan-400"
                                : "text-gray-300 hover:text-cyan-400"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                    
                    {/* Mobile Auth Section */}
                    {user ? (
                        <div className="border-t border-gray-700 pt-4">
                            <p className="text-gray-300 text-sm mb-2">
                                Hi, {user.first_name || user.username}
                            </p>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-red-400 transition-colors"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="border-t border-gray-700 pt-4">
                            <button
                                onClick={handleLogin}
                                className="w-full px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                            >
                                Login with ITC SSO
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
