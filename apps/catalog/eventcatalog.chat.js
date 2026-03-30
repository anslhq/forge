import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

// OpenAI-compatible gateway (see https://www.npmjs.com/package/@ai-sdk/openai-compatible)
const provider = createOpenAICompatible({
  name: 'eventcatalogGateway',
  apiKey: process.env.OPENAI_API_KEY ?? '',
  baseURL: process.env.OPENAI_BASE_URL ?? 'http://localhost:8317/v1',
  includeUsage: true,
});

export default async function getModel() {
  return provider('claude-opus-4-6');
}

export const configuration = {
  topP: 0.9,
  topK: 40,
  frequencyPenalty: 0.0,
  presencePenalty: 0.0,
  temperature: 0.7,
  maxTokens: 10000,
};
