import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Auth from './Auth';

const Admin = () => {
    const [data, setData] = useState({ users: [], collections: [], history: [] });
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    const fetchAdminData = useCallback(async () => {
        try {
            const res = await axios.get('https://music-recommendation-1-566r.onrender.com/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        }
    }, [token]);

    useEffect(() => {
        if (token && isAdmin) {
            fetchAdminData();
        }
    }, [token, isAdmin, fetchAdminData]);
    if (!token || !isAdmin) return <Auth setToken={setToken} />;
    return (
        <div className="w-full max-w-4xl bg-hoverpurp p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-primary mb-6">Admin Dashboard</h2>
            
            <h3 className="text-lg font-medium text-gray-800 mb-4">Users</h3>
            <ul className="space-y-2 mb-6">
                {data.users.map((user, index) => (
                    <li key={index} className="text-gray-700">{user.email} {user.is_admin ? '(Admin)' : ''}</li>
                ))}
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mb-4">Collections</h3>
            <ul className="space-y-2 mb-6">
                {data.collections.map((item, index) => (
                    <li key={index} className="text-gray-700">{item.email}: {item.song.title} by {item.song.artists}</li>
                ))}
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mb-4">Search History</h3>
            <ul className="space-y-2">
                {data.history.map((item, index) => (
                    <li key={index} className="text-gray-700">{item.email}: {item.song} ({new Date(item.timestamp).toLocaleString()})</li>
                ))}
            </ul>
        </div>
    );
};
export default Admin;