// H:\NEXT.js\travel-planner-app\auth.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
// this auth() function that comes from NextAuth we use it to know information about the session (who is in now)
export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
});
