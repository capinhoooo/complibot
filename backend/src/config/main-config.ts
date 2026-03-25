/**
 * Centralized configuration for the application
 * All commonly used environment variables should be defined here
 */

// Validate required environment variables on startup
const requiredEnvVars: string[] = ['DATABASE_URL'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`FATAL: Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Warn on missing optional-but-important env vars (LLM keys, chain config)
const warnEnvVars = ['GROQ_API_KEY', 'GOOGLE_GENERATIVE_AI_API_KEY', 'ATTESTER_PRIVATE_KEY', 'COMPLIBOT_SCHEMA_UID'] as const;
for (const envVar of warnEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`WARNING: ${envVar} is not set. Some features will be unavailable.`);
  }
}

// In production, KYC_CONTRACT_ADDRESS is mandatory
if (process.env.NODE_ENV === 'production' && !process.env.KYC_CONTRACT_ADDRESS) {
  console.error('FATAL: KYC_CONTRACT_ADDRESS must be set in production');
  process.exit(1);
}

// App Configuration
export const APP_PORT: number = Number(process.env.APP_PORT) || 3001;
export const NODE_ENV: string = process.env.NODE_ENV || 'development';
export const IS_DEV: boolean = NODE_ENV === 'development';
export const IS_PROD: boolean = NODE_ENV === 'production';

// Database
export const DATABASE_URL: string = process.env.DATABASE_URL as string;

// LLM Provider Keys
export const GROQ_API_KEY: string = process.env.GROQ_API_KEY || '';
export const ANTHROPIC_API_KEY: string = process.env.ANTHROPIC_API_KEY || '';
export const OPENAI_API_KEY: string = process.env.OPENAI_API_KEY || '';
export const GOOGLE_API_KEY: string = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';

// Chain / Attestation Configuration
export const ATTESTER_PRIVATE_KEY: string = process.env.ATTESTER_PRIVATE_KEY || '';
export const KYC_CONTRACT_ADDRESS: string = process.env.KYC_CONTRACT_ADDRESS || '';
export const HASHKEY_CHAIN_ID: string = process.env.HASHKEY_CHAIN_ID || '133';
export const COMPLIBOT_SCHEMA_UID: string = process.env.COMPLIBOT_SCHEMA_UID || '';

// CORS
export const CORS_ORIGINS: string = process.env.CORS_ORIGINS || 'http://localhost:3200';

// Testing bypass
export const KYC_BYPASS_FOR_TESTING: boolean = process.env.KYC_BYPASS_FOR_TESTING === 'true';

// Export all as default object for convenience
export default {
  APP_PORT,
  NODE_ENV,
  IS_DEV,
  IS_PROD,
  DATABASE_URL,
  GROQ_API_KEY,
  ANTHROPIC_API_KEY,
  OPENAI_API_KEY,
  GOOGLE_API_KEY,
  ATTESTER_PRIVATE_KEY,
  KYC_CONTRACT_ADDRESS,
  HASHKEY_CHAIN_ID,
  COMPLIBOT_SCHEMA_UID,
  CORS_ORIGINS,
  KYC_BYPASS_FOR_TESTING,
};
