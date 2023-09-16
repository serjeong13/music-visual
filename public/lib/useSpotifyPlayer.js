import { useState, useEffect } from "react";

const useSpotifyPlayer = (token, trackId) => {
  const [player, setPlayer] = useState(null);
  const [isPaused, setPaused] = useState(false);
  const [isActive, setActive] = useState(false);
  const [currentTrack, setTrack] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = async () => {
      // Existing logic...
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(token); // Ensure you're passing token as a prop
        },
        volume: 0.5,
      });

      player.on("initialization_error", ({ message }) => {
        console.error("Failed to initialize", message);
      });

      player.addListener("ready", async ({ device_id }) => {
        try {
          const res = await fetch(
            `/api/playPlayerTrackId?trackId=${trackId}&deviceId=${device_id}`
          );
          const data = await res.json(); // Added await
          // You can now handle the response data here
        } catch (error) {
          console.error("An error occurred:", error);
        }
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", async (state) => {
        console.log("Player State Changed: ", state);
        if (!state) {
          setActive(false);
          return;
        }

        // state.track_window.current_track = props.track;
        setTrack(state.track_window.current_track);
        setPaused(state.paused);
        setActive(true);
        player.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
        });
      });

      player.connect();
      setPlayer(player);
    };

    return () => {
      script.remove();
      if (player) {
        player.disconnect();
      }
    };
  }, [token, trackId]);

  return { player, isPaused, isActive, currentTrack };
};

export default useSpotifyPlayer;
