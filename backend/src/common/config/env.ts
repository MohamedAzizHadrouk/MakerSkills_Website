import { resolve } from 'path';
import { existsSync } from 'fs';

/**
 * Resolve JWT secret. In production, JWT_SECRET is required.
 * In non-production, falls back only for local development convenience.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.trim().length > 0) {
    return secret;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'JWT_SECRET environment variable is required in production',
    );
  }
  return 'dev-only-insecure-secret';
}

/**
 * Resolve uploads directory. Prefer UPLOADS_DIR for containers.
 */
export function getUploadsPath(): string {
  if (process.env.UPLOADS_DIR) {
    return resolve(process.env.UPLOADS_DIR);
  }

  const cwd = process.cwd();
  let uploadsPath = resolve(cwd, 'uploads');

  if (cwd.includes('dist')) {
    uploadsPath = resolve(cwd, '..', 'uploads');
  }

  if (existsSync(uploadsPath)) {
    return uploadsPath;
  }

  const currentDir = __dirname;
  if (currentDir.includes('dist')) {
    uploadsPath = resolve(currentDir, '..', 'uploads');
  } else {
    uploadsPath = resolve(currentDir, '..', 'uploads');
  }

  if (process.platform !== 'win32') {
    const homeDir = process.env.HOME || process.env.USERPROFILE || '';
    if (homeDir) {
      const homeUploadsPath = resolve(homeDir, 'backend', 'uploads');
      if (existsSync(homeUploadsPath)) {
        return homeUploadsPath;
      }
    }
  }

  return resolve(
    process.cwd().includes('dist')
      ? resolve(process.cwd(), '..')
      : process.cwd(),
    'uploads',
  );
}

export function getMongodbUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri || !uri.trim()) {
    throw new Error('MONGODB_URI environment variable is required');
  }
  return uri;
}
