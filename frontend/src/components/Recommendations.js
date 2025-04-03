import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Auth from './Auth';

const Recommendations = () => {
    const [song, setSong] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [history, setHistory] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const fetchRecommendations = async () => {
        try {
            const res = await axios.get(`https://music-recommendation-1-566r.onrender.com/recommend?song=${encodeURIComponent(song)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecommendations(res.data.recommendations || []);
            fetchHistory(); // Refresh history after search
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setRecommendations([]);
        }
    };
    const fetchHistory = useCallback(async () => {
        try {
            const res = await axios.get('https://music-recommendation-1-566r.onrender.com/api/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data.history || []);
        } catch (error) {
            console.error('Error fetching history:', error);
            setHistory([]);
        }
    }, [token]); // Dependencies for fetchHistory
    const addToCollection = async (song) => {
        try {
            await axios.post('https://music-recommendation-1-566r.onrender.com/api/collection/add', { song }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Added to collection!');
        } catch (error) {
            console.error('Error adding to collection:', error);
            alert('Failed to add to collection');
        }
    };
    const getStreamingLinks = (title, artists) => {
        const query = encodeURIComponent(`${title} ${artists}`);
        return {
            youtube: `https://www.youtube.com/results?search_query=${query}`,
            spotify: `https://open.spotify.com/search/${query}`
        };
    };
    useEffect(() => {
        if (token) fetchHistory(); // Load history on mount
    }, [token, fetchHistory]); // fetchHistory is now stable
    if (!token) return <Auth setToken={setToken} />;
    return (
        <div className="w-full max-w-2xl bg-card p-6 rounded-lg shadow-md">
            <div className="flex space-x-4 mb-6">
                <input
                    value={song}
                    onChange={(e) => setSong(e.target.value)}
                    placeholder="Enter song name"
                    className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                    onClick={fetchRecommendations}
                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 transition duration-300"
                >
                    Get Recommendations
                </button>
            </div>
            {/* Search History */}
            {history.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-primary mb-2">Search History</h3>
                    <ul className="space-y-2">
                        {history.map((item, index) => (
                            <li key={index} className="text-gray-700">
                                {item.song} <span className="text-gray-500 text-sm">({new Date(item.timestamp).toLocaleString()})</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {/* Recommendations */}
            {recommendations.length > 0 ? (
                <ul className="space-y-4">
                    {recommendations.map((rec, index) => {
                        const { youtube, spotify } = getStreamingLinks(rec.title, rec.artists);
                        return (
                            <li
                                key={index}
                                className="p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition duration-200"
                            >
                                <p className="text-lg font-medium text-gray-800">
                                    <b>{rec.title}</b> by {rec.artists}
                                </p>
                                <div className="mt-2 space-x-4">
                                    <a
                                        href={youtube}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-secondary hover:underline"
                                    >
                                        YouTube
                                    </a>
                                    <a
                                        href={spotify}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-secondary hover:underline"
                                    >
                                        Spotify
                                    </a>
                                    <button
                                        onClick={() => addToCollection({ title: rec.title, artists: rec.artists })}
                                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                                    >
                                        Add to Collection
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-gray-600">No recommendations found.</p>
            )}
        </div>
    );
};
export default Recommendations;