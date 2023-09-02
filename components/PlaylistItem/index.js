const PlaylistItem = ({ playlist }) => {
  return (
    <div>
      <h2>{playlist.name}</h2>
      <p>{playlist.description}</p>
    </div>
  );
};

export default PlaylistItem;
