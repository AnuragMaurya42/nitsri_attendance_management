import { exec } from 'child_process';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { website, name } = req.body;

  if (!website) {
    return res.status(400).json({ error: 'Website is required' });
  }

  const scriptPath = path.resolve('./pages/email/main.py');
  const command = `python3 "${scriptPath}" "${website}" "${name || ''}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Execution error:', error);
      return res.status(500).json({ error: 'Script execution failed', detail: stderr });
    }

    try {
      const result = JSON.parse(stdout);
      res.status(200).json(result);
    } catch (err) {
      console.error('JSON parse error:', err);
      return res.status(500).json({ error: 'Invalid response from script', raw: stdout });
    }
  });
}
