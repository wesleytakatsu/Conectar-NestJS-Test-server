import { execSync } from 'child_process';
import { join } from 'path';
import * as fs from 'fs';

beforeAll(async () => {
  const testDbPath = join(__dirname, '../prisma/test.db');
  
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }

  process.env.DATABASE_URL = `file:${testDbPath}`;
  
  try {
    execSync('npx prisma migrate deploy', {
      cwd: join(__dirname, '..'),
      stdio: 'inherit',
    });
    
    execSync('npx prisma generate', {
      cwd: join(__dirname, '..'),
      stdio: 'inherit',
    });
  } catch (error) {
    process.exit(1);
  }
});

afterAll(async () => {
  const testDbPath = join(__dirname, '../prisma/test.db');
  
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
});