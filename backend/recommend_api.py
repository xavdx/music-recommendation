from flask import Flask, request, jsonify
from recommendation.recommendation_engine import recommend

app = Flask(__name__)

@app.route('/recommend', methods=['GET'])
def get_recommendations():
    song_title = request.args.get('song')
    if not song_title:
        return jsonify({'error': 'Song title is required'}), 400
    recommendations = recommend(song_title)
    return jsonify({'recommendations': recommendations})

if __name__ == '__main__':
    app.run(port=5001)