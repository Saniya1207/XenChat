const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ DB connection failed:', err.message);
  } else {
    console.log('✅ PostgreSQL connected — XenChat DB ready');
    release();
  }
});

module.exports = pool;