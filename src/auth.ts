import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import { FailedLoginResponse, SuccessLoginResponse } from "@/interfaces/login";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },

      authorize: async (credentials) => {
        const res = await fetch(
          "https://ecommerce.routemisr.com/api/v1/auth/signin",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          },
        );

        const payload: any = await res.json();

        if (!res.ok) return null;

        return {
          name: payload.user.name,
          email: payload.user.email,
          role: payload.user.role,
          _id: payload.user._id,
          accessToken: payload.token,
        } as any;
      },
    }),
  ],

  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.user = {
          _id: (user as any)._id,
          name: user.name ?? "",
          email: user.email ?? "",
          role: (user as any).role ?? "",
        };

        token.token = (user as any).accessToken;
      }

      return token;
    },

    session: ({ session, token }) => {
      session.user = token.user as any;
      session.token = token.token as string;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
