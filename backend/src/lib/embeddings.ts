import { createGoogleGenerativeAI, type GoogleEmbeddingModelOptions } from '@ai-sdk/google';
import { GOOGLE_API_KEY } from '@/config/main-config.ts';

const google = createGoogleGenerativeAI({
  apiKey: GOOGLE_API_KEY,
});

// gemini-embedding-001: 3072 default dimensions, free tier available
// Using outputDimensionality=768 for pgvector storage efficiency
// Used exclusively for RAG knowledge base embeddings
export const embeddingModel = google.embedding('gemini-embedding-001');

export const EMBEDDING_DIMENSIONS = 768;

/**
 * Provider options to pass to embed() / embedMany() calls.
 * Sets outputDimensionality to 768 and taskType for retrieval use cases.
 */
export const embeddingProviderOptions = {
  google: {
    outputDimensionality: EMBEDDING_DIMENSIONS,
  } satisfies GoogleEmbeddingModelOptions,
};
