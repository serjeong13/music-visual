import { getUsersPlaylists } from "../../../public/lib/spotify.js";
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

    const response = await getUsersPlaylists(accessToken);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Spotify API error here" });
    }

    const { items } = await response.json();

    // Uncomment below to actually use the "items"
    // console.log(items);

    // For now, let's just send a success status with a message
    res.status(200).json({ name: "Playlists API success", playlists: items });
  } catch (error) {
    console.error("Error in /api/playlists:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
