import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshAccessToken(token: any) {
  try {
    const response = await fetch(process.env.API_URL + "/api/v1/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + refreshedTokens.expiresIn * 1000,
    };
  } catch (error) {
    console.error("Error refreshing token", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}


export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const res = await fetch(process.env.API_URL + "/api/v1/login", {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        });
        const user = await res.json();
        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.data.access_token;
        token.refreshToken = user.data.refresh_token;
        token.accessTokenExpires = Date.now() + user.data.expires_in * 1000;
      }

      // if (Date.now() < token.accessTokenExpires) {
        return token;
      // }

      // return await refreshAccessToken(token);

    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        const response = await fetch(process.env.API_URL + '/api/v1/users/me', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token.accessToken,
          },
        });
        const res = await response.json();
        session.user.name = res.data.name;
        session.user.email = res.data.email;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      };
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  }
};


export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
