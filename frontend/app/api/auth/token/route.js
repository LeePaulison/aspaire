import { auth } from '@/lib/auth';
import { signJWT } from '@/lib/jwt-web.js';

export async function GET(req) {
  const session = await auth();

  if (!session?.user) {
    console.warn('[API] No session found');
    return new Response('Unauthorized', { status: 401 });
  }

  // Create a payload from the session
  const payload = {
    sub: session.user.id || session.user.email,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
    iat: Math.floor(Date.now() / 1000), // issued at
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // expires in 24 hours
  };

  try {
    const signed = await signJWT(payload, process.env.JWT_SECRET);

    const parts = signed.split('.');
    console.log('[API] token split count:', parts.length);
    console.log('[API] token:', signed);

    if (parts.length !== 3) {
      console.warn('[API] Still malformed');
      return new Response('Invalid token', { status: 400 });
    }

    return Response.json({ token: signed });
  } catch (error) {
    console.error('[API] Error signing JWT:', error);
    return new Response('Error generating token', { status: 500 });
  }
}
