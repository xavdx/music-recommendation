import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? 'login' : 'register';
        try {
            const res = await axios.post(`https://music-recommendation-1-566r.onrender.com/api/auth/${endpoint}`, { email, password });
            if (isLogin) {
                setToken(res.data.token);
                localStorage.setItem('token', res.data.token);
            }
            alert(isLogin ? 'Logged in!' : 'Registered!');
        } catch (error) {
            alert(error.response?.data?.message || 'Error occurred');
        }
    };
    return (
        <div>
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
                Switch to {isLogin ? 'Register' : 'Login'}
            </button>
        </div>
    );
};
export default Auth;