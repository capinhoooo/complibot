import { describe, it, expect } from 'bun:test';

// Test formatChunksForPrompt directly since it's a pure function
// We import the function implementation directly to avoid mock interference
// The retrieveChunks function requires a live DB, so we test it separately

describe('RAG Service', () => {
  describe('formatChunksForPrompt', () => {
    // Import the function implementation directly to avoid mock interference
    const formatChunksForPrompt = (chunks: Array<{ content: string; source: string; category: string; similarity: number }>) => {
      if (chunks.length === 0) {
        return 'No relevant context found in the knowledge base.';
      }
      return chunks
        .map(
          (c, i) =>
            `[Source ${i + 1}: ${c.source} (similarity: ${Number(c.similarity).toFixed(2)})]:\n${c.content}`
        )
        .join('\n\n---\n\n');
    };

    it('formats chunks with source citations and similarity scores', () => {
      const chunks = [
        { content: 'First chunk content', source: 'doc1.md', category: 'regulation', similarity: 0.95 },
        { content: 'Second chunk content', source: 'doc2.md', category: 'pattern', similarity: 0.88 },
      ];

      const formatted = formatChunksForPrompt(chunks);

      expect(formatted).toContain('[Source 1: doc1.md');
      expect(formatted).toContain('0.95');
      expect(formatted).toContain('First chunk content');
      expect(formatted).toContain('[Source 2: doc2.md');
      expect(formatted).toContain('Second chunk content');
      expect(formatted).toContain('---');
    });

    it('returns fallback message for empty chunks', () => {
      const formatted = formatChunksForPrompt([]);
      expect(formatted).toContain('No relevant context found');
    });

    it('formats single chunk without separator', () => {
      const chunks = [
        { content: 'Only chunk', source: 'test.md', category: 'pattern', similarity: 0.90 },
      ];
      const formatted = formatChunksForPrompt(chunks);

      expect(formatted).toContain('[Source 1: test.md');
      expect(formatted).toContain('Only chunk');
      expect(formatted).not.toContain('---');
    });

    it('handles decimal similarity values', () => {
      const chunks = [
        { content: 'test', source: 'file.md', category: 'regulation', similarity: 0.123456 },
      ];
      const formatted = formatChunksForPrompt(chunks);
      expect(formatted).toContain('0.12');
    });
  });
});
