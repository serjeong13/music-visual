import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

export default NextAuth({
  providers: [
    SpotifyProvider({
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-email,playlist-read-private",
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
  ],

  //using NEXTAUTH_SECRET for added security.
  secret: process.env.NEXTAUTH_SECRET,

  //in JWT callback adding the refresh_token from the account to the token object.
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.refresh_token;
      }
      return token;
    },

    //in session callback updating the session object with the user object.
    async session(session, user) {
      session.user = user;
      return session;
    },
  },
});
