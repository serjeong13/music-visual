import { postPlayerTrackId } from "../../../../public/lib/spotify";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      //401 status if the session is not found.
      return res.status(401).json({ error: "Unauthorized try" });
    }

    const {
      token: { accessToken },
    } = session;

    //extract the track ID from the request query parameters
    const trackId = req.query.trackId;

    //extract the device ID from the request query parameters
    const deviceId = req.query.deviceId;

    //API call to Spotify by using postPlayerTrackId function which needs an access token, grabbed from the session, and trackId and device, grabbed from the request query parameters.
    const response = await postPlayerTrackId(accessToken, trackId, deviceId);
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        error: "Spotify API error",
        //the specific error message from Spotify API.
        errorMessage: errorData.error.message,
      });
    }

    // send a success status with a message
    res.status(200).json({ name: "PostPlayer success" });
  } catch (error) {
    //500 status in case of internal server errors.
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
