import { suggestSearchTerms } from '../../services/generators/suggest.js';

export async function handleOpenAISuggestions(req, res) {
  try {
    const body = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', (chunk) => (data += chunk));
      req.on('end', () => resolve(JSON.parse(data)));
      req.on('error', reject);
    });

    const { resume } = body;
    const suggestions = await suggestSearchTerms(resume);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ suggestions }));
  } catch (err) {
    console.error('[OpenAI Suggest] Error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}
