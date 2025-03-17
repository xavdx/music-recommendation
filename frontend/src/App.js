import React from 'react';
import axios from 'axios';
import Recommendations from './components/Recommendations';

function App() {
    return (
        <div className="App">
            <h1>Music Recommendation Engine</h1>
            <Recommendations />
        </div>
    );
}

const fetchRecommendations = async () => {
    console.log('Fetching recommendations for:', song);
    try {
        const res = await axios.get(`http://localhost:5000/api/songs/recommend/${encodeURIComponent(song)}`);
        console.log('Response:', res.data);
        setRecommendations(res.data.recommendations || []);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        setRecommendations([]);
    }
};

export default App;