import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

// This is the Spotify Player component that will be used to play the tracks.
export default function SpotifyPlayer({ trackId }) {
  const { data: sessionData } = useSession();
  const session = sessionData?.session;
  const [player, setPlayer] = useState(null);
  const [playbackState, setPlaybackState] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const refreshToken = async () => {
    try {
      const response = await axios.post("/api/refresh_token", {
        refreshToken: session.user?.refresh_token,
      });
      setAccessToken(response.data.accessToken);
    } catch (error) {
      console.error("Failed to refresh token", error.message);
    }
  };

  useEffect(() => {
    if (!session) {
      console.error("Session or user details are not available.");
      return; // Exit the function early
    }
    refreshToken();
  }, [session]);

  //This useEffect hook will be used to load the Spotify Web Playback SDK script.
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    // This function will be called when the Spotify Web Playback SDK script is loaded.
    window.onSpotifyWebPlaybackSDKReady = async () => {
      console.log("Session Data on spotifyplayer:", session);
      if (!accessToken) {
        console.error("No access token available. Cannot proceed.");
        return;
      }

      const playerInstance = new window.Spotify.Player({
        name: "Spotify Player",
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
      });
      setPlayer(playerInstance);
    };
  }, [accessToken]);

  // This useEffect hook will be used to connect the player to the Spotify Web Playback SDK.
  useEffect(() => {
    if (!player) return;
    player.addListener("player state changed", (state) => {
      console.log("Spotify Player State Changed:", state);
      setPlaybackState(state);
    });
    player.connect();
  }, [player]);

  // This useEffect hook will be used to play the track based on trackId.
  useEffect(() => {
    if (!player || !trackId) return;

    player.play({ uris: [`spotify:track:${trackId}`] });
  }, [player, trackId]);

  return (
    <div>
      <button
        onClick={() => {
          if (player) {
            player.togglePlay().then(() => {
              console.log("Spotify player Toggled playback!");
            });
          }
        }}
      >
        Toggle Play/Pause
      </button>
      <div>
        {playbackState && (
          <div>
            <p>Track: {playbackState.track_window.current_track.name}</p>
            {/* <p>
              Artist: {playbackState.track_window.current_track.artists[0].name}
            </p> */}
            <p>Status: {playbackState.paused ? "Paused" : "Playing"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
