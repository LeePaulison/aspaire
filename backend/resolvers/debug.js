// Debug resolver to show exactly what's in the context

export const debugResolvers = {
  Query: {
    // Shows the raw context object
    debugContext: (parent, args, context) => {
      console.log('\n🔍 DEBUG: Full context object:', JSON.stringify(context, null, 2));
      
      return {
        hasUser: !!context.user,
        userInfo: context.user ? {
          sub: context.user.sub,
          email: context.user.email,
          name: context.user.name,
          tokenIssuedAt: context.user.iat ? new Date(context.user.iat * 1000).toISOString() : null,
          tokenExpiresAt: context.user.exp ? new Date(context.user.exp * 1000).toISOString() : null
        } : null,
        timestamp: new Date().toISOString(),
        message: context.user ? 'User is authenticated' : 'No user in context (not authenticated)'
      };
    },

    // Shows step-by-step auth flow
    debugAuthFlow: (parent, args, context) => {
      const steps = [];
      
      steps.push('1. GraphQL request received');
      steps.push('2. Context function executed');
      steps.push('3. getUserFromRequest() called');
      
      if (context.user) {
        steps.push('4. JWT token found and verified ✅');
        steps.push(`5. User extracted: ${context.user.sub || context.user.email}`);
        steps.push('6. Context created with user data');
      } else {
        steps.push('4. No JWT token or invalid token ❌');
        steps.push('5. Context created with user: null');
      }
      
      steps.push('7. Context passed to this resolver');
      
      return {
        steps,
        authenticated: !!context.user,
        userId: context.user ? (context.user.sub || context.user.email) : null
      };
    }
  }
};
