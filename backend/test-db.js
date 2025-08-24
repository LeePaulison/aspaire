import { pool } from './db/pool.js';

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const versionResult = await pool.query('SELECT version()');
    console.log('✅ Database connected:', versionResult.rows[0].version.substring(0, 50) + '...');
    
    // Test if users table exists
    const tableResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'aspire' 
      AND table_name = 'users';
    `);
    
    if (tableResult.rows.length > 0) {
      console.log('✅ Users table exists');
      
      // Test user count
      const countResult = await pool.query('SELECT COUNT(*) FROM users');
      console.log(`✅ Users table has ${countResult.rows[0].count} records`);
    } else {
      console.log('❌ Users table does NOT exist');
      
      // List all tables in aspire schema
      const allTablesResult = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'aspire';
      `);
      console.log('Available tables in aspire schema:', allTablesResult.rows.map(r => r.table_name));
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    process.exit(0);
  }
}

testDatabase();
