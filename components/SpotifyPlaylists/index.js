import React from "react";
import { useSpotifyPlaylists } from "../../src/hooks/useSpotifyPlaylists";

const SpotifyPlaylists = () => {
  const { playlists, isLoading, isError } = useSpotifyPlaylists();

  if (isLoading) return <p>Loading playlists...</p>;
  if (isError) return <p>Error fetching playlists!</p>;
  if (!playlists) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Your Spotify Playlists:</h1>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>{playlist.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SpotifyPlaylists;
