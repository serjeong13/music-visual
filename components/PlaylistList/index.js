import Link from "next/link";

function PlaylistList({ playlists }) {
  return (
    <div>
      <h1>All Playlists</h1>
      <ul>
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

export default PlaylistListComponent;
