/**
 * Knowledge Base Ingestion Script
 *
 * Reads all markdown and Solidity files from the knowledge/ directory,
 * splits them into chunks, generates embeddings via Google gemini-embedding-001 (768d),
 * and stores them in the KnowledgeChunk table with pgvector.
 *
 * Usage: bun run scripts/ingest.ts
 * Requires: DATABASE_URL, GOOGLE_GENERATIVE_AI_API_KEY
 */

import 'dotenv/config';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { embedMany } from 'ai';
import { embeddingModel, embeddingProviderOptions } from '../src/lib/embeddings.ts';
import { prisma } from '../src/lib/prisma.ts';

const KNOWLEDGE_DIR = join(import.meta.dir, '..', 'knowledge');
const CHUNK_SIZE = 1000;

interface Chunk {
  content: string;
  source: string;
  category: string;
}

function categorize(filePath: string): string {
  if (filePath.includes('regulations/')) return 'regulation';
  if (filePath.includes('patterns/')) return 'pattern';
  if (filePath.includes('templates/')) return 'template';
  if (filePath.includes('hashkey/')) return 'hashkey';
  return 'general';
}

/**
 * Split text into chunks using semantic separators.
 * Tries to split on headers first, then paragraphs, then newlines.
 */
function splitIntoChunks(text: string, source: string, category: string): Chunk[] {
  const chunks: Chunk[] = [];
  const separators = ['\n## ', '\n### ', '\n\n', '\n'];

  let segments = [text];
  for (const sep of separators) {
    const newSegments: string[] = [];
    for (const segment of segments) {
      if (segment.length <= CHUNK_SIZE) {
        newSegments.push(segment);
      } else {
        const parts = segment.split(sep);
        let current = '';
        for (const part of parts) {
          const candidate = current ? current + sep + part : part;
          if (candidate.length > CHUNK_SIZE && current) {
            newSegments.push(current.trim());
            current = part;
          } else {
            current = candidate;
          }
        }
        if (current.trim()) newSegments.push(current.trim());
      }
    }
    segments = newSegments;
  }

  for (const segment of segments) {
    if (segment.trim().length > 50) {
      chunks.push({ content: segment.trim(), source, category });
    }
  }

  return chunks;
}

async function collectFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((e) => !e.isDirectory() && (e.name.endsWith('.md') || e.name.endsWith('.sol')))
    .map((e) => join(e.parentPath ?? dir, e.name));
}

async function main() {
  console.log('Starting knowledge base ingestion...');
  console.log(`Knowledge directory: ${KNOWLEDGE_DIR}`);

  // Clear existing chunks
  const deleted = await prisma.$executeRaw`DELETE FROM "KnowledgeChunk"`;
  console.log(`Cleared ${deleted} existing chunks`);

  const files = await collectFiles(KNOWLEDGE_DIR);
  console.log(`Found ${files.length} files to ingest`);

  if (files.length === 0) {
    console.warn('No files found. Check the knowledge/ directory path.');
    await prisma.$disconnect();
    return;
  }

  const allChunks: Chunk[] = [];
  for (const file of files) {
    const content = await readFile(file, 'utf-8');
    const source = relative(KNOWLEDGE_DIR, file);
    const category = categorize(source);
    const chunks = splitIntoChunks(content, source, category);
    allChunks.push(...chunks);
    console.log(`  ${source}: ${chunks.length} chunks (category: ${category})`);
  }

  console.log(`\nTotal: ${allChunks.length} chunks. Generating embeddings...`);

  // Batch embed in small groups to respect Google free tier rate limits
  // Free tier: 100 requests/min. Use small batches with generous delays.
  const BATCH_SIZE = 10;
  for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
    const batch = allChunks.slice(i, i + BATCH_SIZE);

    // Rate limit: wait between batches (skip first)
    if (i > 0) {
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(allChunks.length / BATCH_SIZE);
      console.log(`  Waiting 5s before batch ${batchNum}/${totalBatches}...`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: batch.map((c) => c.content),
      providerOptions: embeddingProviderOptions,
    });

    // Insert with raw SQL because Prisma does not support vector type natively
    for (let j = 0; j < batch.length; j++) {
      const chunk = batch[j];
      const vector = `[${embeddings[j].join(',')}]`;
      await prisma.$executeRaw`
        INSERT INTO "KnowledgeChunk" (id, content, embedding, source, category, metadata, "createdAt")
        VALUES (
          ${crypto.randomUUID()},
          ${chunk.content},
          ${vector}::vector,
          ${chunk.source},
          ${chunk.category},
          ${JSON.stringify({ source: chunk.source })}::jsonb,
          NOW()
        )
      `;
    }

    console.log(`Embedded ${Math.min(i + BATCH_SIZE, allChunks.length)}/${allChunks.length} chunks`);
  }

  console.log('\nIngestion complete.');
  console.log('Next step: verify with SELECT count(*) FROM "KnowledgeChunk";');
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Ingestion failed:', error);
  process.exit(1);
});
