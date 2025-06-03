import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

console.log(process.env.GOOGLE_REDIRECT_URI);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      authorization: {
        params: {
          scope: "openid profile email https://www.googleapis.com/auth/calendar",
          access_type: "offline",
          prompt: "consent",
          redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      console.log(token, account, profile);
      if (account && account.provider === "google") {
        token.googleAccessToken = account.access_token;
        token.googleRefreshToken = account.refresh_token;
        token.googleExpiresAt = account.expires_at;
        token.user = {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          picture: profile.image,
        };
      }
      /*if (token.googleExpiresAt && Date.now() / 1000 > token.googleExpiresAt - 60) {
        try {
          const url =
            "https://oauth2.googleapis.com/token" +
            `?client_id=${process.env.GOOGLE_CLIENT_ID}` +
            `&client_secret=${process.env.GOOGLE_CLIENT_SECRET}` +
            "&grant_type=refresh_token" +
            `&refresh_token=${token.googleRefreshToken}`;

          const response = await fetch(url, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            method: "POST",
          });
          const refreshedTokens = await response.json();

          if (response.ok) {
            token.googleAccessToken = refreshedTokens.access_token;
            token.googleExpiresAt = Math.floor(Date.now() / 1000) + refreshedTokens.expires_in;
            if (refreshedTokens.refresh_token) {
              token.googleRefreshToken = refreshedTokens.refresh_token;
            }
          } else {
            token.error = "RefreshAccessTokenError";
          }
        } catch {
          token.error = "RefreshAccessTokenError";
        }
      }*/
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = {
          id: token.user.id,
          email: token.user.email,
          name: token.user.name,
          image: token.user.picture,
        };
        session.googleAccessToken = token.googleAccessToken;
        session.googleRefreshToken = token.googleRefreshToken;
        session.googleExpiresAt = token.googleExpiresAt;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
