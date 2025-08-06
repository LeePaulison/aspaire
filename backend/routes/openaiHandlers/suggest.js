import { suggestSearchTerms } from '../../services/generators/suggest.js';
import { logAIHistory } from '../../lib/logAIHistory.js';

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

    await logAIHistory({
      conversationId: 'c-' + crypto.randomUUID(),
      userId: req.user?.id || 'mock-user-id',
      type: 'search_term_suggestion',
      title: 'Search Term Suggestion',
      input: { resume },
      output: { suggestions },
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ suggestions }));
  } catch (err) {
    console.error('[OpenAI Suggest] Error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}
