const TrackItem = ({ track }) => {
  return (
    <div>
      <h3>{track.name}</h3>
      <p>{track.artists[0].name}</p>
      <p>{track.duration_ms}</p>
    </div>
  );
};
