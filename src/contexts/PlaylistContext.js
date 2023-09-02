import { createContext, useContext, useState, useEffect } from "react";

export const PlaylistContext = createContext({
  playlist: [],
  setPlaylist: () => {},
  tracks: [],
  setTracks: () => {},
});

export function usePlaylist() {
  return useContext(PlaylistContext);
}

export function PlaylistProvider({ children }) {
  const [playlist, setPlaylist] = useState([]);
  const [tracks, setTracks] = useState([]);

  const value = {
    playlist,
    setPlaylist,
    tracks,
    setTracks,
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
}
