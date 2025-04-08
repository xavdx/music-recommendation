import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [isAdminLogin, setIsAdminLogin] = useState(false); // New state for admin login
    const [error, setError] = useState('');
    const [showVideo, setShowVideo] = useState(true); // State to control video visibility
    const navigate = useNavigate();
    useEffect(() => {
        // Hide video after 5 seconds or when it ends
        const timer = setTimeout(() => setShowVideo(false), 5000);
        return () => clearTimeout(timer); // Cleanup timer on unmount
    }, []);

    const handleVideoEnd = () => {
        setShowVideo(false); // Hide video when it finishes
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isLogin ? 'login' : 'register';
        try {
            const res = await axios.post(
                `https://music-recommendation-1-566r.onrender.com/api/auth/${endpoint}`,
                { email: email.trim(), password: password.trim() }
            );
            console.log('Login/Register Response:', res.data);
            if (isLogin) {
                setToken(res.data.token);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('is_admin', res.data.is_admin !== undefined ? res.data.is_admin : false);
                navigate((res.data.is_admin && isAdminLogin) ? '/admin' : '/recommendations');
            } else {
                alert('Registered! Please log in.');
                setIsLogin(true);
            }
        } catch (error) {
            setError(error.response?.data?.error || 'Error occurred');
        }
    };
    return (
        <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105 flex flex-col items-center">
            {showVideo && (
                <video
                    src="/logo-video.mp4"
                    autoPlay
                    muted //Mute to avoid autoplay restrictions
                    onEnded={handleVideoEnd}
                    className="w-1/2 mb-6"//Adjust width as needed
                />
            )}
            <h2 className="text-2xl font-semibold text-primary mb-6">
                {isLogin ? (isAdminLogin ? 'Admin Login' : 'Login') : 'Register'}
            </h2>
            {error && <p className="text-danger mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 transition duration-300"
                >
                    {isLogin ? (isAdminLogin ? 'Admin Login' : 'Login') : 'Register'}
                </button>
            </form>
            <div className="mt-4 flex justify-between">
                <button
                    onClick={() => { setIsLogin(!isLogin); setIsAdminLogin(false); }}
                    className="text-primary hover:underline"
                >
                    Switch to {isLogin ? 'Register' : 'Login'}
                </button>
                {isLogin && (
                    <button
                        onClick={() => setIsAdminLogin(!isAdminLogin)}
                        className="text-primary hover:underline text-sm"
                    >
                        {isAdminLogin ? 'User Login' : 'Admin Login'}
                    </button>
                )}
            </div>
        </div>
    );
};
export default Auth;