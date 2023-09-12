import { getTrackDetails } from "../../../../public/lib/spotify";
import { getToken } from "../../../../public/lib/spotify";
import { getSession } from "next-auth/react";

// Define an asynchronous handler function for the API route
const handler = async (req, res) => {
  try {
    const session = await getSession({ req });

    // Check for authentication and presence of access token
    if (!session || !session.token || !session.token.accessToken) {
      return res.status(401).json({ error: "Unauthorized try" });
    }

    const {
      token: { accessToken },
    } = session;

    // Extract the track ID from the request query parameters
    const trackId = req.query.trackId;

    // Fetch track details using the access token and track ID
    const response = await getTrackDetails(accessToken, trackId);
    const response_token = await getToken(accessToken);

    if (!response.ok) {
      // If the response is not OK, parse the JSON to get the error details
      const errorData = await response.json();
      return res.status(response.status).json({
        error: "Spotify API error",
        errorMessage: errorData.error.message,
      });
    }

    const items = await response.json();

    res
      .status(200)
      .json({ name: "Track API success", track: items, token: response_token });
  } catch (error) {
    console.error(`Error in track API: ${error.message}`);
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "Internal Server Error";
    return res.status(statusCode).json({ error: errorMessage });
  }
};

export default handler;
