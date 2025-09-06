import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export async function GET(req) {
  console.log('[API] Token route called');
  
  // Get the database user ID from request parameters or header
  const url = new URL(req.url);
  const dbUserId = url.searchParams.get('userId');
  
  console.log('[API] Database user ID from params:', dbUserId);

  if (!dbUserId) {
    console.warn('[API] No database user ID provided');
    return new Response('Database user ID required', { status: 400 });
  }
  
  // For now, create a simplified payload with just the database user ID
  // In a production app, you'd want to validate the user session first
  const payload = {
    sub: dbUserId, // Use database UUID
    iat: Math.floor(Date.now() / 1000), // issued at
  };
  
  console.log('[API] JWT payload being created:', JSON.stringify(payload, null, 2));
  console.log('[API] JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('[API] JWT_SECRET length:', process.env.JWT_SECRET?.length);

  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '24h' // Use expiresIn option instead of exp in payload
    });

    console.log('[API] JWT token created:', token.substring(0, 20) + '...');
    console.log('[API] Token created for user:', payload.sub);

    return Response.json({ token });
  } catch (error) {
    console.error('[API] Error signing JWT:', error);
    return new Response('Error generating token', { status: 500 });
  }
}
