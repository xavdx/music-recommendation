import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Recommendations from './components/Recommendations';
function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    // Clear token on logout
    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };
    return (
        <Router>
            <div className="App">
                <h1>Music Recommendation Engine</h1>
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
                {token && <button onClick={handleLogout}>Logout</button>}
            </div>
        </Router>
    );
}
export default App;