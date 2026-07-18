// Environment configuration — the ONLY file allowed to read process.env.
// Validates required variables at startup so the server fails fast
// with a clear error instead of crashing later mid-request.

import 'dotenv/config'

function required(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing environment variable: ${name}. Check your server/.env file.`
    )
  }
  return value
}

export const env = {
  port: Number(process.env.PORT ?? 5000),
  mongoUri: required('MONGO_URI'),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
} as const
