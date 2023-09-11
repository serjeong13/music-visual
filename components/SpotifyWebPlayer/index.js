import React, { useEffect } from "react";

const SpotifyWebPlayer = ({ trackId }) => {
  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://sdk.scdn.co/spotify-player.js";

    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, [trackId]);

  window.onSpotifyWebPlaybackSDKReady = () => {
    const token = "gg"; // Get this from your auth flow
    const player = new Spotify.Player({
      name: "Your Spotify Player",
      getOAuthToken: (cb) => {
        cb(token);
      },
      volume: 0.5,
    });

    // Add event listeners here as per your HTML script

    player.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id);
      fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
        {
          method: "PUT",
          body: JSON.stringify({ uris: [`spotify:track:${trackId}`] }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    });

    // ... (other listeners)

    player.connect();
  };

  return (
    <div>
      <h1>Spotify Web Playback SDK Quick Start</h1>
      <button
        id="togglePlay"
        onClick={() => {
          // Implement togglePlay logic here
        }}
      >
        Toggle Play
      </button>
    </div>
  );
};

export default SpotifyWebPlayer;
