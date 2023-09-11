import { playTrackSpotifyPlayer } from "../../../../public/lib/spotify";
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
    const playTrackId = req.query.playTrackId;
    const response = await playTrackSpotifyPlayer(
      accessToken,
      playTrackId
    ).catch((error) => {
      console.error("error", error);
    });
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        error: "Spotify API error",
        errorMessage: errorData.error.message,
      });
    }

    const items = await response.json();
    res.status(200).json({ name: "Play Track API success", playTrack: items });
  } catch (error) {
    console.error("error", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
