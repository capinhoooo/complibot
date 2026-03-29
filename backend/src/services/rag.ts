import { embed } from 'ai';
import { embeddingModel, embeddingProviderOptions } from '@/lib/embeddings.ts';
import { prisma } from '@/lib/prisma.ts';

export interface RetrievedChunk {
  content: string;
  source: string;
  category: string;
  similarity: number;
}

/**
 * Retrieve relevant knowledge chunks from pgvector using cosine similarity.
 * Generates an embedding for the query, then performs a vector search
 * against the KnowledgeChunk table.
 */
export async function retrieveChunks(
  query: string,
  options: {
    topK?: number;
    categories?: string[];
    minSimilarity?: number;
  } = {}
): Promise<RetrievedChunk[]> {
  const { topK = 5, categories, minSimilarity = 0.7 } = options;

  // Generate embedding for the query
  const { embedding } = await embed({
    model: embeddingModel,
    value: query,
    providerOptions: embeddingProviderOptions,
  });

  const vector = `[${embedding.join(',')}]`;

  // Cosine similarity search using pgvector <=> operator
  // Lower distance = higher similarity; cosine distance = 1 - cosine_similarity
  let chunks: RetrievedChunk[];

  if (categories && categories.length > 0) {
    chunks = await prisma.$queryRaw<RetrievedChunk[]>`
      SELECT
        content,
        source,
        category,
        1 - (embedding <=> ${vector}::vector) AS similarity
      FROM "KnowledgeChunk"
      WHERE category = ANY(${categories})
        AND 1 - (embedding <=> ${vector}::vector) >= ${minSimilarity}
      ORDER BY embedding <=> ${vector}::vector
      LIMIT ${topK}
    `;
  } else {
    chunks = await prisma.$queryRaw<RetrievedChunk[]>`
      SELECT
        content,
        source,
        category,
        1 - (embedding <=> ${vector}::vector) AS similarity
      FROM "KnowledgeChunk"
      WHERE 1 - (embedding <=> ${vector}::vector) >= ${minSimilarity}
      ORDER BY embedding <=> ${vector}::vector
      LIMIT ${topK}
    `;
  }

  return chunks;
}

/**
 * Format retrieved chunks into a string suitable for prompt injection.
 * Each chunk is labeled with its source and similarity score.
 */
export function formatChunksForPrompt(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) {
    return 'No relevant context found in the knowledge base.';
  }

  return chunks
    .map(
      (c, i) =>
        `[Source ${i + 1}: ${c.source} (similarity: ${Number(c.similarity).toFixed(2)})]:\n${c.content}`
    )
    .join('\n\n---\n\n');
}
