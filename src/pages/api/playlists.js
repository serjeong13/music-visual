import { getUserPlaylists } from "../../../public/lib/spotify.js";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  try {
    const session = await getSession({ req });
    console.log("session111111111", session);
    if (!session) {
      //401 status if the session is not found.
      return res.status(401).json({ error: "Unauthorized try" });
    }

    const {
      token: { accessToken },
    } = session;

    //API call to Spotify by using getUserPlaylists function which needs an access token, grabbed from the session.
    const response = await getUserPlaylists(accessToken);
    console.log("accessToken444444", accessToken);
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        error: "Spotify API error",
        //the specific error message from Spotify API.
        errorMessage: errorData.error.message,
      });
    }

    const { items } = await response.json();

    // send a success status with a message
    res.status(200).json({ name: "Playlists API success", playlists: items });
  } catch (error) {
    //500 status in case of internal server errors.
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
