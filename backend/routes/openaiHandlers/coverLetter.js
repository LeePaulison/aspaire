import { generateCoverLetter } from '../../services/generators/coverLetter.js';

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

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ letter }));
  } catch (err) {
    console.error('[OpenAI Cover Letter] Error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}
