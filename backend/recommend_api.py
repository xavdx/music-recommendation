from flask import Flask, request, jsonify
from flask_cors import CORS
from recommendation.recommendation_engine import recommend
import os
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import uuid

app = Flask(__name__)
CORS(app, resources={
    r"/recommend": {"origins": ["http://localhost:3000", "https://music-recommendation-drab.vercel.app"]},
    r"/api/auth/*": {"origins": ["http://localhost:3000", "https://music-recommendation-drab.vercel.app"]}
})

#MongoDB Atlas connection
mongo_uri = "mongodb+srv://anshavdesai:anshav51@musiccluster.fzaq8.mongodb.net/?retryWrites=true&w=majority&appName=MusicCluster"
client = MongoClient(mongo_uri)
db = client['musicdb']  #Database's name
users_collection = db['users']  #A Collection for users

@app.route('/test', methods=['GET'])
def test():
    print("Test endpoint hit")
    return jsonify({'message': 'Test route works'})

@app.route('/', methods=['GET'])
def root():
    print("Root endpoint hit")
    return jsonify({'message': 'Welcome to the Music Recommendation API'})

@app.route('/recommend', methods=['GET'])
def get_recommendations():
    print("Recommend endpoint hit")
    song_title = request.args.get('song')
    print(f"Received request for song: {song_title}")
    if not song_title:
        return jsonify({'error': 'Song title is required'}), 400
    recommendations = recommend(song_title)
    print(f"Returning: {recommendations}")
    return jsonify({'recommendations': recommendations})

@app.route('/api/auth/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        #Handle preflight request
        response = jsonify({'message': 'Preflight OK'})
        response.headers['Access-Control-Allow-Origin'] = 'https://music-recommendation-drab.vercel.app'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response, 200

    #Handle POST request
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    #To check if user exists
    if users_collection.find_one({'email': email}):
        return jsonify({'error': 'User already exists'}), 409

    #Hash password and save to MongoDB
    hashed_password = generate_password_hash(password)
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
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = users_collection.find_one({'email': email})
    if user and check_password_hash(user['password'], password):
        # Generate a simple token
        token = str(uuid.uuid4())
        return jsonify({'message': 'Login successful', 'token': token}), 200
    return jsonify({'error': 'Invalid credentials'}), 401
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)