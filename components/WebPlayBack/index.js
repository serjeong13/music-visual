import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const [retrievedReflection, setRetrievedReflection] = useState([]);

  const handleInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await fetch(`/api/handleUserInput`, {
      method: "POST",
      body: JSON.stringify({ userInput }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    if (data.data) {
      setImageUrl(data.data[0].b64_json);
    }

    const payload = {
      email: session.session.user.email,
      trackId: props.track.id,
      userInput: userInput,
      imageUrl: data.data[0].b64_json,
    };

    const response = await fetch("/api/reflection", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

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

      player.addListener("player_state_changed", async (state) => {
        // TODO: add page refresh when track ends in order to display the input, url of the image

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
    };
  }, []);

  return (
    <div className="container mx-auto p-6 text-center">
      <h2 className="text-2xl font-semibold mb-4">
        {props.track.name} by {props.track.artists[0].name}
      </h2>
      <div>
        <Image
          className="rounded-full mx-auto mb-4"
          src={props.track.album.images[0].url}
          alt="Album cover"
          width={100}
          height={100}
        />
      </div>
      <div className="border">
        <h4 className="text-lg mb-6">
          What are you feeling?{" "}
          {imageUrl && <p className="text-lg mb-2">And what else?</p>}
        </h4>
      </div>

      {isSubmitting && (
        <div>
          <div className="flex flex-wrap justify-center">
            Loading indicator .....
          </div>
          <div></div>
        </div>
      )}

      {imageUrl && (
        <div>
          <img
            className="mx-auto mb-4"
            // src={imageUrl}
            src={`data:image/jpeg;base64,${imageUrl}`}
            alt="Generated image"
            width={500}
            height={500}
          />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <div>
            <input
              value={userInput}
              placeholder="Enter 3 words"
              onChange={handleInput}
              className="inline-block p-2 border rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:ring-opacity-50"
            />
          </div>
          <div>
            <button
              disabled={userInput === "" || isSubmitting}
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Submit
            </button>
          </div>
          <button
            onClick={() => {
              // Redirect to the new page with query parameters
              const email = encodeURIComponent(session.session.user.email);
              const trackId = encodeURIComponent(props.track.id);
              window.location.href = `/reflectionPage?email=${email}&trackId=${trackId}`;
            }}
          >
            See Images
          </button>
        </div>
      </form>
    </div>
  );
}
export default WebPlayback;
