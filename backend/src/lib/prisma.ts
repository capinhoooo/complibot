import { PrismaClient } from '../../prisma/generated/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prismaQuery = new PrismaClient({ adapter });

// Alias for compatibility with CompliBot service code
export const prisma = prismaQuery;
