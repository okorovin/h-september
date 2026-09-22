import pg from 'pg';

// подключение к базе
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/task3',
});
