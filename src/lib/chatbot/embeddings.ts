import OpenAI from 'openai';

let _openai: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

/**
 * Generate embedding for a single text using text-embedding-3-small
 */
export async function getEmbedding(text: string): Promise<number[]> {
  const response = await getClient().embeddings.create({
    model: 'text-embedding-3-small',
    input: text.replace(/\n/g, ' ').trim(),
  });
  return response.data[0].embedding;
}

/**
 * Generate embeddings for multiple texts in batch
 */
export async function getEmbeddings(texts: string[]): Promise<number[][]> {
  const cleaned = texts.map((t) => t.replace(/\n/g, ' ').trim());
  const response = await getClient().embeddings.create({
    model: 'text-embedding-3-small',
    input: cleaned,
  });
  return response.data.map((d) => d.embedding);
}
