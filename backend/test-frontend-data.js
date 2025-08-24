import fetch from 'node-fetch';

async function testWithFrontendData() {
  try {
    console.log('Testing with potentially problematic frontend data...');
    
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
    
    // Test with potentially problematic data
    const testCases = [
      // Case 1: Missing authProviderId (undefined)
      {
        name: "Undefined authProviderId",
        variables: {
          input: {
            authProvider: "GITHUB",
            authProviderId: undefined,
            email: "test@example.com",
            name: "Test User"
          }
        }
      },
      // Case 2: Empty string authProviderId
      {
        name: "Empty authProviderId",
        variables: {
          input: {
            authProvider: "GITHUB", 
            authProviderId: "",
            email: "test@example.com",
            name: "Test User"
          }
        }
      },
      // Case 3: Null values
      {
        name: "Null authProviderId",
        variables: {
          input: {
            authProvider: "GITHUB",
            authProviderId: null,
            email: "test@example.com", 
            name: "Test User"
          }
        }
      },
      // Case 4: Missing required fields
      {
        name: "Missing email",
        variables: {
          input: {
            authProvider: "GITHUB",
            authProviderId: "test123",
            name: "Test User"
            // email missing
          }
        }
      }
    ];
    
    for (const testCase of testCases) {
      console.log(`\n--- Testing: ${testCase.name} ---`);
      
      try {
        const response = await fetch('https://aspaire-backend.fly.dev/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://aspaire.vercel.app'
          },
          body: JSON.stringify({
            query,
            variables: testCase.variables
          }),
        });
        
        const result = await response.json();
        
        console.log(`Status: ${response.status}`);
        
        if (result.errors) {
          console.log(`❌ Errors:`, result.errors.map(e => e.message));
        } else {
          console.log(`✅ Success: User created with ID ${result.data?.createUserWithAuth?.id}`);
        }
        
      } catch (error) {
        console.log(`❌ Request failed: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testWithFrontendData();
