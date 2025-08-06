import { generateCoverLetter } from '../../services/generators/coverLetter.js';
import { logAIHistory } from '../../lib/logAIHistory.js';

export async function handleOpenAICoverLetter(req, res) {
  try {
    const body = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', (chunk) => (data += chunk));
      req.on('end', () => resolve(JSON.parse(data)));
      req.on('error', reject);
    });

    const { jobDescription, resumeContent } = body;
    const letter = await generateCoverLetter({ jobDescription, resumeContent });

    console.log('[OpenAI Cover Letter] Generated letter:', letter);

    await logAIHistory({
      conversationId: 'c-' + crypto.randomUUID(),
      userId: req.user?.id || 'mock-user-id',
      type: 'cover_letter',
      title: 'Cover Letter Generation',
      input: { jobDescription, resumeContent },
      output: { letter },
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ letter }));
  } catch (err) {
    console.error('[OpenAI Cover Letter] Error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}
