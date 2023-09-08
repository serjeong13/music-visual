import { getPlaylistTracks } from "../../../../public/lib/spotify";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ error: "Unauthorized try" });
    }

    const {
      token: { accessToken },
    } = session;

    const playlistId = req.query.playlistId;

    const response = await getPlaylistTracks(accessToken, playlistId);
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        error: "Spotify API error",
        errorMessage: errorData.error.message,
      });
    }

    const { items } = await response.json();

    res.status(200).json({ name: "Tracks API success", tracks: items });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
