from flask import Flask, request, jsonify
from recommendation.recommendation_engine import recommend
import os

app = Flask(__name__)

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

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)