const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

// Encode the client ID and client secret into Base64 format
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

// Define Spotify API endpoints
const token_endpoint = process.env.TOKEN_ENDPOINT;
const playlists_endpoint = process.env.PLAYLISTS_ENDPOINT;

// Function to get an access token using a refresh token
const getAccessToken = async (refresh_token) => {
  const response = await fetch(token_endpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  return response.json();
};

// Function to get the user playlists
export const getUserPlaylists = async (refresh_token) => {
  const { access_token } = await getAccessToken(refresh_token);
  return fetch(playlists_endpoint, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};
