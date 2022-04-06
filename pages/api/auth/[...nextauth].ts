import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { hashPassword } from "../../../services/passwordHelper";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

const database = collection(db, "weather-forecast");

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // CSRF Token has been validated at this point so request is authentic.
        // credentials provide username, password and csrfToken
        // req provides whole request object

        // 1. Check if user and password exists.
        // @ts-ignore
        const email = credentials.email;
        const hashedPassword = await hashPassword(credentials!.password);

        const q = query(
          database,
          where("email", "==", email),
          where("password", "==", hashedPassword)
        );
        const dataQuerySnapshot = await getDocs(q);

        // 2. If username and password does not exist, return false.
        if (dataQuerySnapshot.empty) {
          return null;
        }

        // 3. If user and password match, return success.
        const userData = dataQuerySnapshot.docs[0].data();
        console.log("userData", userData);
        if (userData) {
          return { email: userData.email, name: userData.uid }; // workaround for auto-assign in next-auth
        }

        // 4. Return null
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  callbacks: {
    async session({ session, token }) {
      // console.log("session",session)
      // console.log("token=",token)
      //@ts-ignore
      session.user.uid = token.sub ?? session.user.name;

      // if registered manually
      if (session.user.uid === session.user.name) {
        session.user.name = session.user.email.split("@")[0];
      }

      return session;
    },
  },
  pages: {
    signIn: "/weather-forecast/login",
  },
});
