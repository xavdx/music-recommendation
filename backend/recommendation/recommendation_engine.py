import pandas as pd
import os
import random

current_dir = os.path.dirname(os.path.abspath(__file__))
dataset_path = os.path.join(current_dir, "..", "dataset", "spotify_songs.csv")
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
    
    # Filter songs by genre, excluding the input song
    recommendations = df[(df['genre'] == song_genre) & (df['title'] != song_title)][['title', 'artists']]
    print("Found", len(recommendations), "recommendations")
    
    # Randomly sample 5 songs (or fewer if less than 5 available)
    if len(recommendations) > 5:
        recommendations = recommendations.sample(n=5, random_state=random.randint(1, 10000))
    else:
        recommendations = recommendations.sample(n=len(recommendations), random_state=random.randint(1, 10000))
    
    return recommendations.to_dict(orient='records')