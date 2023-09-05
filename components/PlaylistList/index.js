import Link from "next/link";

// Define the PlaylistList component, which receives 'playlists' as a prop
function PlaylistList({ playlists }) {
  return (
    <div>
      <h1>All Playlists</h1>
      <ul>
        {/* Loop through the 'playlists' array and render each playlist */}
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <Link href={`/playlist/${playlist.id}`}>
              <a>{playlist.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlaylistList;
