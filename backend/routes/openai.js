import { handleOpenAIComplete } from './openaiHandlers/complete.js';
import { handleOpenAICoverLetter } from './openaiHandlers/coverLetter.js';
import { handleOpenAISuggestions } from './openaiHandlers/suggest.js';
import { handleOpenAIStream } from './openaiHandlers/stream.js';

export async function routeOpenAI(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405);
    return res.end('Method Not Allowed');
  }

  switch (req.url) {
    case '/openai/complete':
      return await handleOpenAIComplete(req, res);
    case '/openai/cover-letter':
      return await handleOpenAICoverLetter(req, res);
    case '/openai/suggest':
      return await handleOpenAISuggestions(req, res);
    case '/openai/stream':
      return await handleOpenAIStream(req, res);
    default:
      res.writeHead(404);
      return res.end('Not Found');
  }
}
