const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://west-saryo.vercel.app';

const SITEMAP_PATH = path.resolve(__dirname, 'public', 'sitemap.xml');

const BOOKS_JSON_PATH = path.resolve(__dirname, 'public', 'data', 'books.json');

const staticPagePaths = [
  '/'
];

async function generateSitemap() {
  let bookUrls = [];
  try {
    const booksDataString = fs.readFileSync(BOOKS_JSON_PATH, 'utf8');
    const books = JSON.parse(booksDataString);
    bookUrls = books.map(book => `/book/${book.id}`);
    console.log(`Found ${bookUrls.length} book URLs.`);
  } catch (error) {
    console.error('Error reading or parsing books.json:', error);
  }

 
  const allPaths = [...staticPagePaths, ...bookUrls];

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPaths.map(pagePath => {
    let priorityValue = '0.5';
    if (pagePath === '/') {
      priorityValue = '1.0';
    } else if (pagePath.startsWith('/book/')) {
      priorityValue = '0.9';
    }
    const changefreqValue = pagePath.startsWith('/book/') ? 'yearly' : 'monthly';

    return `
  <url>
    <loc>${BASE_URL}${pagePath}</loc>
    <changefreq>${changefreqValue}</changefreq> 
    <priority>${priorityValue}</priority>
  </url>`;
  }).join('')}
</urlset>`;

  try {
    fs.writeFileSync(SITEMAP_PATH, sitemapContent.trim());
    console.log(`Sitemap successfully generated at ${SITEMAP_PATH}`);
  } catch (error) {
    console.error('Error writing sitemap.xml:', error);
  }
}

generateSitemap();