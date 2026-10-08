import OpenAI from 'openai';

let openaiClientInstance: OpenAI | null = null;

export function getAiClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return null;
  }

  if (!openaiClientInstance) {
    const baseURL = process.env.OPENAI_BASE_URL && process.env.OPENAI_BASE_URL.trim() !== ''
      ? process.env.OPENAI_BASE_URL.trim()
      : undefined;

    openaiClientInstance = new OpenAI({
      apiKey: apiKey.trim(),
      baseURL: baseURL,
    });
  }

  return openaiClientInstance;
}

export function getAiModel(): string {
  return process.env.OPENAI_MODEL && process.env.OPENAI_MODEL.trim() !== ''
    ? process.env.OPENAI_MODEL.trim()
    : 'gpt-4o';
}

export function isAiConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '';
}
