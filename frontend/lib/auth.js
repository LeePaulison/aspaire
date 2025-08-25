import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { getSubFromAuthHeader } from './token.js';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[NextAuth] Issuing new token for user:', user.id);
        }
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      return session;
    },
  },
  secret: process.env.JWT_SECRET,
});

export { getSubFromAuthHeader };
