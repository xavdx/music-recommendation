import pandas as pd
import os

dataset_path = os.path.join(os.path.dirname(__file__), '../../dataset/spotify_songs.csv')
df = pd.read_csv(dataset_path)
df.rename(columns={'track_name': 'title', 'track_genre': 'genre'}, inplace=True)

def recommend(song_title):
    if song_title not in df['title'].values:
        return []
    song_genre = df[df['title'] == song_title]['genre'].values[0]
    recommendations = df[(df['genre'] == song_genre) & (df['title'] != song_title)][['title', 'artists']]
    return recommendations.head(5).to_dict(orient='records')