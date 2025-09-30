const testId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
const testDbFile = require('path').join(__dirname, `../test-db-${testId}.db`);
process.env.DATABASE_URL = `file:${testDbFile}`;
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.NODE_ENV = 'test';