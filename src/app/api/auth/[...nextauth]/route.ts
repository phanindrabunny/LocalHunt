import NextAuth, { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { Adapter } from 'next-auth/adapters';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/lib/mongodb';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';

interface Credentials {
  email?: string;
  password?: string;
}

const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter((async () => {
    const { client } = await connectToDatabase();
    return client;
  })()) as Adapter,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Credentials): Promise<NextAuthUser | null> {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const { db } = await connectToDatabase();
          const user = await db.collection('users').findOne({ email: credentials.email });
          
          if (!user) return null;
          
          // For new users (migrated from Firebase), password might not exist yet
          if (!user.password) return null;
          
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) return null;
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT, user?: NextAuthUser }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session, token: JWT }) {
      if (token && session.user) {
        session.user.role = token.role as string;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };