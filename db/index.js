const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'intrepid1',
  database: 'room_scheduler',
  host: '52.53.108.229',
  port: 5432
});

module.exports = pool;