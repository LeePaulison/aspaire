import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

/**
 * Extract and verify JWT token from request headers
 */
export function getUserFromRequest(req) {
  try {
    const authHeader = req.headers.get?.('authorization') || req.headers.authorization || '';
    
    if (!authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.slice(7); // Remove 'Bearer ' prefix
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Auth] Token verified for user:', decoded.sub || decoded.email);
    }
    return decoded;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Auth] JWT verification failed:', error.message);
    }
    return null;
  }
}

/**
 * Middleware to require authentication
 */
export function requireAuth(context) {
  if (!context.user) {
    throw new Error('Authentication required');
  }
  return context.user;
}

/**
 * Middleware to require specific user ID
 */
export function requireUserId(context, userId) {
  const user = requireAuth(context);
  const userIdFromToken = user.sub || user.id || user.email;
  
  if (userIdFromToken !== userId) {
    throw new Error('Unauthorized: User ID mismatch');
  }
  
  return user;
}

/**
 * Optional authentication - returns user if authenticated, null otherwise
 */
export function getOptionalUser(context) {
  return context.user || null;
}

/**
 * Generate JWT token (for testing or other backend operations)
 */
export function generateToken(payload, expiresIn = '24h') {
  // If payload already has exp, don't add expiresIn option
  const options = { algorithm: 'HS256' };
  if (!payload.exp) {
    options.expiresIn = expiresIn;
  }
  
  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Verify if token is valid and not expired
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
