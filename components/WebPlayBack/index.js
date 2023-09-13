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
  const [userInput, setUserInput] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // send userInput to backend
    const res = await fetch(`/api/handleUserInput`, {
      method: "POST",
      body: JSON.stringify({ userInput }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    if (data.data) {
      setImageUrl(data.data[0].url);
    }
    setIsSubmitting(false);
    setUserInput("");
  };

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
        fetch(
          `/api/playPlayerTrackId?trackId=${props.track.id}&deviceId=${device_id}`
        ).then((res) => res.json());
      });

      player.addListener("player_state_changed", (state) => {
        // TODO: add page refresh when track ends in order to display the input, url of the image

        if (!state) {
          console.log("STATE ON PLAYER", state);
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
    };
  }, []);

  return (
    <>
      <div className="container">
        <div className="main-wrapper">
          <img
            src={props.track.album.images[0].url}
            className="now-playing__cover"
            alt=""
          />

          <div className="now-playing__side">
            <div className="now-playing__name">{props.track.name}</div>

            <div className="now-playing__artist">
              {props.track.artists[0].name}
            </div>

            {imageUrl && (
              <div className="image-container">
                <img src={imageUrl} alt="Generated image" />
              </div>
            )}

            {/* <button
              onClick={() => {
                player.togglePlay();
              }}
            >
              {is_paused ? "PLAY" : "PAUSE"}
            </button> */}
          </div>
        </div>
        <br></br>
        {
          <form onSubmit={handleSubmit}>
            <input type="text" value={userInput} onChange={handleInput} />
            <button disabled={userInput === "" || isSubmitting}>Submit</button>
          </form>
        }
      </div>
    </>
  );
}

export default WebPlayback;
