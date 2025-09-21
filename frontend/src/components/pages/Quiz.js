import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { getCSRFToken, fetchCSRFToken } from '../../utils/csrf';

const Quiz = () => {
    const [user, setUser] = useState(null);
    const [quizStatus, setQuizStatus] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [answer, setAnswer] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [showRollNumber, setShowRollNumber] = useState(false);
    const [displayedRoll, setDisplayedRoll] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [quizStarted, setQuizStarted] = useState(false);
    const [collectedRolls, setCollectedRolls] = useState([]);
    const hasInitialized = useRef(false);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch(`https://wnccb.tech-iitb.org/api/auth/status/`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.authenticated) {
                setUser(data.user);
                setRollNumber(data.user.roll_number || '');
            }
        } catch (error) {
            // Auth check failed
        }
    };

    const checkQuizStatus = useCallback(async () => {
        try {
            const response = await fetch(`https://wnccb.tech-iitb.org/api/quiz/status/`, {
                credentials: 'include'
            });
            const data = await response.json();
            setQuizStatus(data);
            if (data.has_progress && !data.completed) {
                setQuizStarted(true);
                setRollNumber(data.roll_number);
                loadCurrentQuestion();
            } else if (data.completed) {
                // Fetch collected roll numbers for completed quiz
                try {
                    const rollsResponse = await fetch(`https://wnccb.tech-iitb.org/api/quiz/collected-rolls/`, {
                        credentials: 'include'
                    });
                    const rollsData = await rollsResponse.json();
                    if (rollsResponse.ok) {
                        setCollectedRolls(rollsData.rolls);
                    }
                } catch (error) {
                    // Failed to fetch collected rolls
                }
            }
        } catch (error) {
            // Quiz status check failed
        }
    }, []);

    const startQuiz = async () => {
        setLoading(true);
        try {
            const csrfToken = getCSRFToken() || await fetchCSRFToken();
            const response = await fetch(`https://wnccb.tech-iitb.org/api/quiz/start/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include'
            });
            
            const data = await response.json();
            if (response.ok) {
                setQuizStarted(true);
                setMessage('');
                loadCurrentQuestion();
            } else {
                setMessage(data.error || 'Failed to start quiz for this roll number');
            }
        } catch (error) {
            setMessage('Network error. Please try again.');
        }
        setLoading(false);
    };

    const loadCurrentQuestion = async () => {
        try {
            const response = await fetch(`https://wnccb.tech-iitb.org/api/quiz/question/`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setCurrentQuestion(data);
                setAnswer('');
            } else {
                setMessage(data.error || 'Failed to load question');
            }
        } catch (error) {
            setMessage('Network error. Please try again.');
        }
    };

    const loadNextQuestion = useCallback(async () => {
        if (currentQuestion && currentQuestion.question_number < 3) {
            loadCurrentQuestion();
        } else {
            setMessage('Quiz completed! Thank you for participating.');
            setQuizStarted(false);
        }
    }, [currentQuestion]);

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;
        checkAuthStatus();
        checkQuizStatus();
    }, [checkQuizStatus]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (showRollNumber) {
            setShowRollNumber(false);
            loadNextQuestion();
        }
    }, [countdown, showRollNumber, loadNextQuestion]);

    const submitAnswer = async () => {
        if (!answer.trim()) {
            setMessage('Please enter an answer');
            return;
        }

        setLoading(true);
        try {
            const csrfToken = getCSRFToken() || await fetchCSRFToken();
            const response = await fetch(`https://wnccb.tech-iitb.org/api/quiz/submit/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({ answer: answer.trim() })
            });
            
            const data = await response.json();
            if (response.ok) {
                if (data.correct) {
                    setDisplayedRoll(data.roll_number);
                    setShowRollNumber(true);
                    setCountdown(30);
                    setAnswer('');
                    setMessage('');
                    
                    if (data.quiz_completed) {
                        setTimeout(async () => {
                            // Fetch all collected roll numbers
                            try {
                                const rollsResponse = await fetch(`https://wnccb.tech-iitb.org/api/quiz/collected-rolls/`, {
                                    credentials: 'include'
                                });
                                const rollsData = await rollsResponse.json();
                                if (rollsResponse.ok) {
                                    setCollectedRolls(rollsData.rolls);
                                }
                            } catch (error) {
                                // Failed to fetch collected rolls
                            }
                            setMessage('Congratulations! Quiz completed successfully!');
                            setQuizStarted(false);
                        }, 30000);
                    }
                } else {
                    setMessage(data.message || 'Incorrect answer. Try again.');
                }
            } else {
                setMessage(data.error || 'Failed to submit answer');
            }
        } catch (error) {
            setMessage('Network error. Please try again.');
        }
        setLoading(false);
    };

    const handleLogin = () => {
        const redirect = encodeURIComponent(`${window.location.origin}/loading`);
        const projectId = 'f2ec2cd4-1a8e-465c-aacd-5285979ca72a';
        window.location.href = `https://sso.tech-iitb.org/project/${projectId}/ssocall/?redirect=${redirect}`;
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="bg-gray-900 p-8 rounded-xl border border-cyan-500/20 text-center">
                    <h2 className="text-2xl font-bold text-cyan-400 mb-4">Quiz Access</h2>
                    <p className="text-gray-300 mb-6">Please login with SSO to access the quiz</p>
                    <button
                        onClick={handleLogin}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Login with ITC SSO
                    </button>
                </div>
            </div>
        );
    }

    if (quizStatus?.completed) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="bg-gray-900 p-8 rounded-xl border border-green-500/20 text-center max-w-2xl">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-400 mb-4">Quiz Completed!</h2>
                    <p className="text-gray-300 mb-6">You have successfully completed the quiz.</p>
                    
                    {collectedRolls.length > 0 && (
                        <div className="bg-cyan-500/10 p-6 rounded-lg">
                            <h3 className="text-lg font-bold text-cyan-400 mb-4">Your Collected Roll Numbers:</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {collectedRolls.map((roll, index) => (
                                    <div key={index} className="bg-gray-800 p-3 rounded font-mono text-cyan-400">
                                        Question {index + 1}: {roll}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (showRollNumber) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="bg-gray-900 p-8 rounded-xl border border-cyan-500/20 text-center">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-400 mb-4">Correct Answer!</h2>
                    <div className="bg-cyan-500/10 p-6 rounded-lg mb-4">
                        <p className="text-gray-300 mb-2">Note down this roll number:</p>
                        <p className="text-4xl font-bold text-cyan-400 font-mono">{displayedRoll}</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-orange-400">
                        <Clock className="w-5 h-5" />
                        <span className="text-xl font-bold">{countdown}s</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">Next question will appear automatically</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 p-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-gray-900 rounded-xl border border-cyan-500/20 p-6">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-cyan-400 mb-2">WnCC Freshers Challenge</h1>
                        <p className="text-gray-300">Welcome, {user.first_name || user.username}!</p>
                    </div>

                    {message && (
                        <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                            <div className="flex items-center gap-2 text-red-400">
                                <AlertCircle className="w-5 h-5" />
                                <span>{message}</span>
                            </div>
                        </div>
                    )}

                    {!quizStarted ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-2">Your Roll Number:</label>
                                <input
                                    type="text"
                                    value={rollNumber}
                                    readOnly
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-300 cursor-not-allowed"
                                    placeholder="Loading..."
                                />
                                <p className="text-sm text-gray-400 mt-1">Roll number is automatically set from your SSO login</p>
                            </div>
                            <button
                                onClick={startQuiz}
                                disabled={loading || !rollNumber}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {loading ? 'Starting Quiz...' : 'Start Quiz'}
                            </button>
                        </div>
                    ) : currentQuestion ? (
                        <div className="space-y-6">
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-cyan-400 font-semibold">
                                        Question {currentQuestion.question_number} of {currentQuestion.total_questions}
                                    </span>
                                </div>
                                <p className="text-white text-lg">{currentQuestion.question}</p>
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2">Your Answer:</label>
                                <input
                                    type="text"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                    placeholder="Type your answer here..."
                                />
                            </div>

                            <button
                                onClick={submitAnswer}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Submit Answer'}
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
                            <p className="text-gray-300 mt-4">Loading question...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Quiz;