import { generateCompletion } from '../../services/openaiService.js';

export async function handleOpenAIComplete(req, res) {
  try {
    const body = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', (chunk) => (data += chunk));
      req.on('end', () => resolve(JSON.parse(data)));
      req.on('error', reject);
    });

    const { prompt, model } = body;
    const content = await generateCompletion(prompt, model);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ content }));
  } catch (err) {
    console.error('[OpenAI] Error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message || 'Unexpected error' }));
  }
}
