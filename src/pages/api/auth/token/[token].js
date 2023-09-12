//import { getToken } from "next-auth/jwt";
import { getToken } from "../../../../../public/lib/spotify";

const handler = async (req, res) => {
  const session = await getSession({ req });

  // Check for authentication and presence of access token
  if (!session || !session.token || !session.token.accessToken) {
    return res.status(401).json({ error: "Unauthorized try" });
  }

  const {
    token: { accessToken },
  } = session;
  const response = getToken(accessToken);

  res.status(200).json({ name: "Token fetch success", token: response });
};
