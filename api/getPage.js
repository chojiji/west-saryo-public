import path from 'path';
import fs from 'fs/promises';

export default async function handler(req, res) {
  const { bookId, lang, page } = req.query;

  if (!bookId || !lang || !page) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const pageNumber = String(page)

  const filePath = path.join(process.cwd(), 'content', bookId, lang, `${pageNumber}.md`);

  try {
    const fileContent = await fs.readFile(filePath, 'utf8');

    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(fileContent);

  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Page not found' });
  }
}