import { db } from "@/lib/db";
import { decodeJwtToken } from "@/lib/jwt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { User } from "@prisma/client";
import { compare } from "bcrypt";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Type your email" },
        password: { label: "Password", type: "password" },
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        let email = credentials?.email;
        let token = credentials?.token;
        let password = credentials?.password;

        // auto connexion after clicking on email
        if (token) {
          const decodedUser = decodeJwtToken<User>(token);
          if (decodedUser) {
            const existingUser = await db.user.findUnique({
              where: {
                email: decodedUser?.email,
                password: decodedUser?.password,
              },
            });
            if (existingUser?.id) {
              return {
                id: existingUser.id.toString(),
                email: existingUser.email,
              };
            }
          }
        }

        if (!email || !password) {
          return null;
        }

        const existingUser = await db.user.findUnique({
          where: { email: email },
        });

        if (!existingUser) {
          return null;
        }

        if (!existingUser.isVerified) {
          return null;
        }
        const passwordMatch = await compare(password, existingUser.password);

        if (!passwordMatch) {
          return null;
        }

        return {
          id: existingUser.id.toString(),
          email: existingUser.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      return {
        ...session,
        user: token,
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };