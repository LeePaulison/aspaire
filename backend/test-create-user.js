import fetch from 'node-fetch';

async function testCreateUser() {
  try {
    console.log('Testing createUserWithAuth mutation...');
    
    const query = `
      mutation CreateUserWithAuth($input: CreateUserInput!) {
        createUserWithAuth(input: $input) {
          id
          authProviderId
          authProvider
          email
          name
          preferences {
            userId
            preferredLocations
            remote
            industries
            salaryMin
            salaryMax
            notificationsEnabled
            paginationLimit
            preferredTitles
            preferredSkills
            salaryCurrency
            createdAt
            updatedAt
          }
          resumes(limit: 10, offset: 0) {
            id
            originalFilename
            description
            sourceType
            createdAt
            updatedAt
          }
        }
      }
    `;
    
    const variables = {
      input: {
        authProviderId: "test123",
        authProvider: "GITHUB",
        email: "test@example.com",
        name: "Test User"
      }
    };
    
    const response = await fetch('https://aspaire-backend.fly.dev/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://aspaire.vercel.app'
      },
      body: JSON.stringify({
        query,
        variables
      }),
    });
    
    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));
    console.log('Response body:', JSON.stringify(result, null, 2));
    
    if (result.errors) {
      console.error('❌ GraphQL errors:', result.errors);
    } else {
      console.log('✅ User creation successful');
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testCreateUser();
