const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',        
  host: 'localhost',
  database: 'uts_react',   
  password: '290804', 
  port: 5432,
});

module.exports = pool;