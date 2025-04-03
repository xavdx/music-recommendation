import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Recommendations from './components/Recommendations';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <Router>
            <div className="App min-h-screen bg-primary flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold text-card mb-6">
                    Music Recommendation Engine
                </h1>
                <Routes>
                    <Route
                        path="/auth"
                        element={token ? <Navigate to="/recommendations" /> : <Auth setToken={setToken} />}
                    />
                    <Route
                        path="/recommendations"
                        element={token ? <Recommendations /> : <Navigate to="/auth" />}
                    />
                    <Route path="/" element={<Navigate to="/auth" />} />
                </Routes>
                {token && (
                    <button
                        onClick={handleLogout}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                    >
                        Logout
                    </button>
                )}
            </div>
        </Router>
    );
}

export default App;