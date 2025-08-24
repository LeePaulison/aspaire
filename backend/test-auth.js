import { generateToken, verifyToken } from './middleware/auth.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

// Test JWT functionality
async function testJWT() {
  console.log('🧪 Testing JWT Authentication...\n');
  
  // Create a test user payload (same format as your frontend)
  const testPayload = {
    sub: 'test-user-123',
    email: 'test@example.com',
    name: 'Test User',
    image: 'https://example.com/avatar.jpg',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
  };

  try {
    // Generate token
    console.log('1. Generating JWT token...');
    const token = generateToken(testPayload);
    console.log('✅ Token generated:', token.substring(0, 50) + '...');

    // Verify token
    console.log('\n2. Verifying JWT token...');
    const decoded = verifyToken(token);
    if (decoded) {
      console.log('✅ Token verified successfully!');
      console.log('📋 Decoded payload:', {
        sub: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        exp: new Date(decoded.exp * 1000).toISOString()
      });
    } else {
      console.log('❌ Token verification failed');
    }

    // Test invalid token
    console.log('\n3. Testing invalid token...');
    const invalidDecoded = verifyToken('invalid.token.here');
    if (invalidDecoded) {
      console.log('❌ Invalid token was accepted (this is bad!)');
    } else {
      console.log('✅ Invalid token correctly rejected');
    }

    console.log('\n🎉 JWT authentication tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testJWT();
