const fs = require('fs');
const path = require('path');

const publicPath = path.join(__dirname, 'public'); 
const dataPath = path.join(publicPath, 'data');
const detailsPath = path.join(dataPath, 'details');
const prerenderedPath = path.join(publicPath, 'prerendered');

if (!fs.existsSync(prerenderedPath)) {
  fs.mkdirSync(prerenderedPath, { recursive: true });
}

const createHtmlTemplate = (book, details) => {
  const descriptionText = details.description || `${book.author_ko}의 저서 '${book.title_ko}'에 대한 정보 페이지입니다.`;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <title>${book.title_ko} - ${book.author_ko} | 서양사료강독</title>
  
  <meta name="description" content="${descriptionText}">
  
  <style>
    body { font-family: sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: auto; }
    h1, h2 { margin-bottom: 0; }
    h2 { color: #555; font-size: 1.2em; margin-top: 0; }
    p { margin-top: 1em; }
    .note { color: #888; font-style: italic; }
  </style>
</head>
<body>
  <h1>${book.title_ko}</h1>
  <h2>${book.title_original}</h2>
  
  <p><strong>저자:</strong> ${book.author_ko} (${book.author_original})</p>
  
  <hr>
  
  <p>${descriptionText}</p>
  
  <br>
</body>
</html>`;
};

async function generatePrerenderedPages() {
  try {
    const booksFilePath = path.join(dataPath, 'books.json');
    if (!fs.existsSync(booksFilePath)) {
      throw new Error('books.json 파일을 찾을 수 없습니다!');
    }
    const allBooksContent = fs.readFileSync(booksFilePath, 'utf-8');
    const allBooks = JSON.parse(allBooksContent);

    console.log(`총 ${allBooks.length}개의 책에 대한 사전 렌더링을 시작합니다...`);

    for (const book of allBooks) {
      const detailsFilePath = path.join(detailsPath, `${book.id}.json`);
      let details = {};
      if (fs.existsSync(detailsFilePath)) {
        const detailsContent = fs.readFileSync(detailsFilePath, 'utf-8');
        details = JSON.parse(detailsContent);
      } else {
        console.warn(`- 경고: ${book.id}.json 파일을 찾을 수 없습니다. 기본 정보만 사용합니다.`);
      }
      const htmlContent = createHtmlTemplate(book, details);
      const outputFilePath = path.join(prerenderedPath, `${book.id}.html`);
      fs.writeFileSync(outputFilePath, htmlContent);
      console.log(`- 성공: ${book.id}.html 파일 생성 완료`);
    }

    console.log('\n사전 렌더링 작업이 성공적으로 완료되었습니다.');
  } catch (error) {
    console.error('\n사전 렌더링 중 심각한 오류가 발생했습니다:', error);
    process.exit(1);
  }
}

generatePrerenderedPages();