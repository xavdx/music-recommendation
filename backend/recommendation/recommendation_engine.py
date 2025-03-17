import pandas as pd
import os

dataset_path = "C:\\Anshav Desai\\SEM 6 Project\\music-recommendation\\dataset\\spotify_songs.csv"
df = pd.read_csv(dataset_path)
df.rename(columns={'track_name': 'title', 'track_genre': 'genre'}, inplace=True)
print("Dataset loaded with", len(df), "songs")  # Confirm dataset load

def recommend(song_title):
    print("Searching for:", song_title)
    if song_title not in df['title'].values:
        print("Song not found in dataset")
        return []
    song_genre = df[df['title'] == song_title]['genre'].values[0]
    print("Genre:", song_genre)
    recommendations = df[(df['genre'] == song_genre) & (df['title'] != song_title)][['title', 'artists']]
    print("Found", len(recommendations), "recommendations")
    return recommendations.head(5).to_dict(orient='records')