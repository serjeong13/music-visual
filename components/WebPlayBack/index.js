import React, { useState, useEffect } from "react";

function WebPlayback(props) {
  // Maintain player state
  const track = {
    name: "",
    album: {
      images: [{ url: "" }],
    },
    artists: [{ name: "" }],
  };
  const [player, setPlayer] = useState(undefined);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState(track);

  // Run this once when the component mounts
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    // This should be defined before the script loads
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(props.token); // Ensure you're passing token as a prop
        },
        volume: 0.5,
      });

      // Update state with player object
      setPlayer(player);
      player.on("initialization_error", ({ message }) => {
        console.error("Failed to initialize", message);
      });

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        // get track info from prop.track
        // send the track uri and device_id to the play endpoint through backend
        //https://api.spotify.com/v1/me/player/play (13ad70e1bc43ba7bee6e87f0eebb6fb491b25e9a),
        //    {
        //     "uris": ["spotify:track:7j9BbKDn6skg3iX1Hwjr0W"]
        // }
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        // state.track_window.current_track = props.track;
        setTrack(state.track_window.current_track);
        setPaused(state.paused);
        console.log(state);
        player.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
        });
      });

      player.connect();
    };
  }, []); // Re-run if props.token changes

  return (
    <>
      <div className="container">
        <div className="main-wrapper">
          <img
            src={current_track.album.images[0].url}
            className="now-playing__cover"
            alt=""
          />

          <div className="now-playing__side">
            <div className="now-playing__name">{current_track.name}</div>

            <div className="now-playing__artist">
              {current_track.artists[0].name}
            </div>
            <button
              onClick={() => {
                player.previousTrack();
              }}
            >
              &lt;&lt;
            </button>

            <button
              onClick={() => {
                player.togglePlay();
              }}
            >
              {is_paused ? "PLAY" : "PAUSE"}
            </button>

            <button
              className="btn-spotify"
              onClick={() => {
                player.nextTrack();
              }}
            >
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default WebPlayback;
