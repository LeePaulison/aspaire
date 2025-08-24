import fetch from 'node-fetch';

async function testQuery() {
  try {
    console.log('Testing GraphQL schema query...');
    
    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '{ __schema { queryType { name } } }'
      }),
    });
    
    const result = await response.json();
    console.log('Schema query result:', result);
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
    } else {
      console.log('✅ GraphQL schema is working');
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testQuery();
