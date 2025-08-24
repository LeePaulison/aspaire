import { generateToken, verifyToken } from './middleware/auth.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

function inspectToken() {
  console.log('🔍 Token Inspection\n');
  
  // Generate a token
  const payload = {
    sub: 'test-user-123',
    email: 'test@example.com',
    name: 'Test User',
    image: 'https://example.com/avatar.jpg',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
  };
  
  console.log('📤 Original payload we put INTO the token:');
  console.log(JSON.stringify(payload, null, 2));
  
  const token = generateToken(payload);
  console.log('\n🎫 Generated token:');
  console.log(token);
  
  // Decode the token
  const decoded = verifyToken(token);
  console.log('\n📥 What we get BACK from the token:');
  console.log(JSON.stringify(decoded, null, 2));
  
  // Show all keys
  console.log('\n🔑 All keys in the decoded token:');
  if (decoded) {
    Object.keys(decoded).forEach(key => {
      console.log(`  - ${key}: ${decoded[key]}`);
    });
  }
  
  // Check for jti specifically
  if (decoded && decoded.jti) {
    console.log('\n⚠️  JTI found!');
    console.log(`jti value: ${decoded.jti}`);
  } else {
    console.log('\n✅ No JTI key found in token');
  }
}

inspectToken();
