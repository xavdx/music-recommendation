from flask import Flask, request, jsonify
from flask_cors import CORS
from recommendation.recommendation_engine import recommend
import os
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import logging
import datetime

app = Flask(__name__)
CORS(app, resources={
    r"/recommend": {"origins": ["http://localhost:3000", "https://music-recommendation-drab.vercel.app"]},
    r"/api/auth/*": {"origins": ["http://localhost:3000", "https://music-recommendation-drab.vercel.app"]},
    r"/api/collection/*": {"origins": ["http://localhost:3000", "https://music-recommendation-drab.vercel.app"]},
    r"/api/history/*": {"origins": ["http://localhost:3000", "https://music-recommendation-drab.vercel.app"]}
})
logging.basicConfig(level=logging.DEBUG)
mongo_uri = "mongodb+srv://anshavdesai:anshav51@musiccluster.fzaq8.mongodb.net/?retryWrites=true&w=majority&appName=MusicCluster"
client = MongoClient(mongo_uri)
db = client['musicdb']
users_collection = db['users']
collections_collection = db['collections']
history_collection = db['history']

@app.route('/test', methods=['GET'])
def test():
    print("Test endpoint hit")
    return jsonify({'message': 'Test route works'})

@app.route('/', methods=['GET'])
def root():
    print("Root endpoint hit")
    return jsonify({'message': 'Welcome to the Music Recommendation API'})

@app.route('/recommend', methods=['GET', 'OPTIONS'])
def get_recommendations():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'Preflight OK'})
        response.headers['Access-Control-Allow-Origin'] = 'https://music-recommendation-drab.vercel.app'
        response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
        return response, 200

    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        logging.debug("No token provided")
        return jsonify({'error': 'Authorization token required'}), 401

    song_title = request.args.get('song')
    logging.debug(f"Recommend - Song: {song_title}, Token: {token}")
    if not song_title:
        return jsonify({'error': 'Song title is required'}), 400
    email = users_collection.find_one({'token': token})['email'] if users_collection.find_one({'token': token}) else None
    if email:
        history_collection.insert_one({
            'email': email,
            'song': song_title,
            'timestamp': datetime.datetime.utcnow()
        })

    recommendations = recommend(song_title)
    return jsonify({'recommendations': recommendations})
    # logging.debug(f"Recommendations: {recommendations}")
    return jsonify({'recommendations': recommendations})

@app.route('/api/auth/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'Preflight OK'})
        response.headers['Access-Control-Allow-Origin'] = 'https://music-recommendation-drab.vercel.app'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response, 200

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    if users_collection.find_one({'email': email}):
        return jsonify({'error': 'User already exists'}), 409

    hashed_password = generate_password_hash(password)
    logging.debug(f"Registering user - Email: {email}, Hashed Password: {hashed_password}")
    users_collection.insert_one({'email': email, 'password': hashed_password})
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'Preflight OK'})
        response.headers['Access-Control-Allow-Origin'] = 'https://music-recommendation-drab.vercel.app'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response, 200

    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = users_collection.find_one({'email': email})
    if user and check_password_hash(user['password'], password):
        token = str(uuid.uuid4())
        users_collection.update_one({'email': email}, {'$set': {'token': token}})
        return jsonify({'message': 'Login successful', 'token': token}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/collection/add', methods=['POST', 'OPTIONS'])
def add_to_collection():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'Preflight OK'})
        response.headers['Access-Control-Allow-Origin'] = 'https://music-recommendation-drab.vercel.app'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
        return response, 200

    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'error': 'Authorization token required'}), 401

    data = request.get_json()
    email = users_collection.find_one({'token': token})['email'] if users_collection.find_one({'token': token}) else None
    if not email:
        return jsonify({'error': 'Invalid token'}), 401

    song = data.get('song')
    if not song or not song.get('title') or not song.get('artists'):
        return jsonify({'error': 'Song title and artists are required'}), 400

    collections_collection.insert_one({
        'email': email,
        'song': {'title': song['title'], 'artists': song['artists']},
        'added_at': datetime.datetime.utcnow()
    })
    return jsonify({'message': 'Song added to collection'}), 201

@app.route('/api/history', methods=['GET', 'OPTIONS'])
def get_search_history():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'Preflight OK'})
        response.headers['Access-Control-Allow-Origin'] = 'https://music-recommendation-drab.vercel.app'
        response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
        return response, 200

    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'error': 'Authorization token required'}), 401

    email = users_collection.find_one({'token': token})['email'] if users_collection.find_one({'token': token}) else None
    if not email:
        return jsonify({'error': 'Invalid token'}), 401

    history = list(history_collection.find({'email': email}).sort('timestamp', -1).limit(10))  # Last 10 searches
    return jsonify({'history': [{'song': h['song'], 'timestamp': h['timestamp'].isoformat()} for h in history]})
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)