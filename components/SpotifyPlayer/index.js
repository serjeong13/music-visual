import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { playTrackSpotifyPlayer } from "../../public/lib/spotify";

// This is the Spotify Player component that will be used to play the tracks.
export default function SpotifyPlayer({ playTrackId }) {
  const { data: sessionData } = useSession();
  const session = sessionData?.session;

  const [player, setPlayer] = useState(null);
  // This state will be used to keep track of the current track.
  const [playbackState, setPlaybackState] = useState(null);

  //This useEffect hook will be used to load the Spotify Web Playback SDK script.
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    // This function will be called when the Spotify Web Playback SDK script is loaded.
    window.onSpotifyWebPlaybackSDKReady = async () => {
      console.log("Session Data:", session);
      if (!session) {
        console.error("Session or user details are not available.");
        return; // Exit the function early
      }
      const response = await playTrackSpotifyPlayer(
        session.user?.refresh_token,
        playTrackId
      );

      if (!response) {
        console.error("No access token available. Cannot proceed.");
        return;
      }

      console.log(
        "Access Token:",
        response.headers.Authorization.split(" ")[1]
      );
      const player = new window.Spotify.Player({
        name: "Spotify Player",
        getOAuthToken: (cb) => {
          cb(response.headers.Authorization.split(" ")[1]);
        },
      });
      setPlayer(player);
    };
  }, [playTrackId, session]);

  // This useEffect hook will be used to connect the player to the Spotify Web Playback SDK.
  useEffect(() => {
    if (!player) return;
    player.addListener("player state changed", (state) => {
      console.log("Player State Changed:", state);
      setPlaybackState(state);
    });
    player.connect();
  }, [player]);

  // This useEffect hook will be used to play the track based on trackId.
  useEffect(() => {
    if (!player || !playTrackId) return;

    player.play({ uris: [`spotify:track:${playTrackId}`] });
  }, [player, playTrackId]);

  return (
    <div>
      <button
        onClick={() => {
          if (player) {
            player.togglePlay().then(() => {
              console.log("Toggled playback!");
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
            <p>
              Artist: {playbackState.track_window.current_track.artists[0].name}
            </p>
            <p>Status: {playbackState.paused ? "Paused" : "Playing"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
