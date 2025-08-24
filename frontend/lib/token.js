import { verifyJWT } from './jwt-web.js';

export async function getSubFromAuthHeader(authHeader) {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7); // remove 'Bearer '
  try {
    const payload = await verifyJWT(token, JWT_SECRET);
    return payload?.sub || null;
  } catch (err) {
    console.warn('[JWT] Invalid token:', err);
    return null;
  }
}
