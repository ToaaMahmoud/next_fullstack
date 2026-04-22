import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import { toPublicUser } from "@/lib/auth";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: any; account: any; profile?: any }) {
      await connectDB();

      const existingUser = await User.findOne({ email: user.email });

      if (existingUser) {
        // Update user if needed
        existingUser.name = user.name || existingUser.name;
        await existingUser.save();
        user.id = existingUser._id.toString();
      } else {
        // Create new user
        const newUser = await User.create({
          name: user.name,
          email: user.email,
          phone: "", // Google doesn't provide phone
          password: "", // No password for social login
          role: "customer",
          status: "active",
          favorites: [],
          emailVerified: true, // Google verifies email
        });
        user.id = newUser._id.toString();
      }

      return true;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (token.userId) {
        const userDoc = await User.findById(token.userId);
        if (userDoc) {
          session.user = toPublicUser(userDoc);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
