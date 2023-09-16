import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

function WebPlayback(props) {
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
  const { data: retrievedReflection, error } = useSWR(
    session
      ? `/api/reflection?email=${session.session.user.email}&trackId=${props.track.id}`
      : null,
    fetcher
  );

  const handleInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/userInput`, {
        method: "POST",
        body: JSON.stringify({ userInput }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      const payload = {
        email: session.session.user.email,
        trackId: props.track.id,
        trackName: props.track.name,
        artistName: props.track.artists[0].name,
        trackImage: props.track.album.images[0].url,
        userInput: userInput,
        imageUrl: data.data[0].b64_json,
      };

      mutate(
        `/api/reflection?email=${session.session.user.email}&trackId=${props.track.id}`,
        { ...retrievedReflection, ...payload },
        false
      );

      if (data.data) {
        setImageUrl(data.data[0].b64_json);
        payload.imageUrl = data.data[0].b64_json;
      }

      await fetch("/api/reflection", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      mutate(
        `/api/reflection?email=${session.session.user.email}&trackId=${props.track.id}`
      );
    } catch (error) {
      console.log("Error occured", error);
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
    };
  }, []);

  return (
    <div className="container mx-auto p-6 text-center items-center">
      <h2 className="text-lg font-bold">{props.track.name}</h2>
      <p className="text-sm text-gray-500 mb-4">
        by {props.track.artists[0].name}
      </p>
      <div>
        <Image
          className="rounded-full mx-auto mb-4 mt-4"
          src={props.track.album.images[0].url}
          alt="Album cover"
          width={100}
          height={100}
        />
      </div>
      <div className="border">
        <h4 className="text-lg mb-6">
          What do you feel when you hear this track?{" "}
          {imageUrl && <p className="text-lg mb-2"></p>}
        </h4>
      </div>

      {isSubmitting && (
        <div>
          <div className="flex flex-wrap justify-center">
            Loading the image .....
          </div>
        </div>
      )}

      {imageUrl && (
        <div className="mb-8">
          <img
            src={`data:image/jpeg;base64,${imageUrl}`}
            alt="Generated image"
            width={500}
            height={500}
          />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center justify-center mt-8">
          <input
            className="w-full max-w-lg mb-8 mt-8 text-center"
            value={userInput}
            placeholder="Enter 3 words, press enter"
            onChange={handleInput}
          />
        </div>
      </form>
      <div className="mt-30">
        <button
          type="button"
          onClick={() => {
            // Redirect to the new page with query parameters
            const email = encodeURIComponent(session.session.user.email);
            const trackId = encodeURIComponent(props.track.id);
            window.location.href = `/reflection?email=${email}&trackId=${trackId}`;
          }}
        >
          See Images
        </button>
      </div>
    </div>
  );
}
export default WebPlayback;
