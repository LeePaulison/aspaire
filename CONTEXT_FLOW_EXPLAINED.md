# GraphQL Context Data Flow Explanation

## Step-by-Step Flow

```
1. Client Request
   ↓
2. GraphQL Yoga Server
   ↓
3. Context Function (server.js:29)
   ↓
4. getUserFromRequest() Middleware
   ↓
5. JWT Token Extraction & Verification
   ↓
6. Context Object Created
   ↓
7. Passed to Resolver Functions
```

## Detailed Breakdown

### 1. **Client Makes Request**
```javascript
fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  },
  body: JSON.stringify({
    query: 'query { preferences { id } }'
  })
})
```

### 2. **GraphQL Yoga Receives Request**
The request object contains:
- `request.headers` - including Authorization header
- `request.body` - the GraphQL query/variables
- `request.method`, `request.url`, etc.

### 3. **Context Function Executes** (server.js line 29)
```javascript
const yoga = createYoga({
  schema,
  context: ({ request }) => {
    // This function runs for EVERY GraphQL request
    return { 
      user: getUserFromRequest(request) // Extract user from JWT
    }
  },
  // ... other options
});
```

### 4. **getUserFromRequest() Extracts User**
```javascript
// middleware/auth.js
export function getUserFromRequest(req) {
  try {
    // Get Authorization header
    const authHeader = req.headers.get?.('authorization') || req.headers.authorization || '';
    
    if (!authHeader.startsWith('Bearer ')) {
      return null; // No token provided
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.slice(7);
    
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    console.log('[Auth] Token verified for user:', decoded.sub || decoded.email);
    return decoded; // Return the user data from token
  } catch (error) {
    console.warn('[Auth] JWT verification failed:', error.message);
    return null; // Invalid/expired token
  }
}
```

### 5. **Context Object Created**
After `getUserFromRequest()` runs, the context object looks like:
```javascript
// If authenticated:
context = {
  user: {
    sub: "github-user-123",
    email: "user@example.com", 
    name: "John Doe",
    image: "https://avatars.githubusercontent.com/...",
    iat: 1642687200,
    exp: 1642773600
  }
}

// If NOT authenticated:
context = {
  user: null
}
```

### 6. **Context Passed to Resolvers**
Every resolver function receives this context as the 3rd parameter:

```javascript
// resolvers/preferences.js
export const preferencesResolvers = {
  Query: {
    preferences: async (parent, args, context) => {
      //                              ↑
      //                         This is the context object!
      
      console.log('Context user:', context.user);
      // context.user contains the JWT payload or null
      
      const user = requireAuth(context); // Throws if context.user is null
      const userId = user.sub || user.email;
      return await getPreferencesByUserId(userId);
    }
  }
}
```

## Visual Flow Diagram

```
HTTP Request with JWT
        ↓
┌─────────────────────┐
│   GraphQL Yoga      │
│   Server Receives   │
│   Request          │
└─────────────────────┘
        ↓
┌─────────────────────┐
│   Context Function  │
│   Executes:         │
│   { request } =>    │
│   { user: ... }     │
└─────────────────────┘
        ↓
┌─────────────────────┐
│ getUserFromRequest()│
│ • Extract header    │
│ • Verify JWT       │
│ • Return user data │
└─────────────────────┘
        ↓
┌─────────────────────┐
│   Context Object    │
│   { user: decoded } │
│   OR                │
│   { user: null }    │
└─────────────────────┘
        ↓
┌─────────────────────┐
│   Resolver Gets     │
│   Context as 3rd    │
│   Parameter         │
└─────────────────────┘
        ↓
┌─────────────────────┐
│   requireAuth()     │
│   Checks if         │
│   context.user      │
│   exists            │
└─────────────────────┘
```

## Key Points

1. **Context function runs for EVERY request** - even unauthenticated ones
2. **If no JWT token** → `context.user = null`
3. **If valid JWT token** → `context.user = decoded JWT payload`
4. **If invalid JWT token** → `context.user = null` (doesn't crash)
5. **Resolvers decide** whether to require auth using `requireAuth(context)`

## Example Request Flow

### Authenticated Request:
```
1. Client: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
2. Context: { user: { sub: "user123", email: "user@example.com" } }
3. Resolver: requireAuth(context) → returns user object
4. Query: Executes with user data
```

### Unauthenticated Request:
```
1. Client: No Authorization header
2. Context: { user: null }
3. Resolver: requireAuth(context) → throws "Authentication required" error
4. Query: Returns error to client
```

## Important Notes

- The context function is **synchronous** - it completes before any resolver runs
- JWT verification happens **once per request** in the context function
- All resolvers in the same request share the **same context object**
- You can add more data to context (database connections, etc.)

## Adding More Data to Context

You can extend the context with additional data:

```javascript
context: ({ request }) => ({
  user: getUserFromRequest(request),
  db: database,
  startTime: Date.now(),
  requestId: generateRequestId()
}),
```
