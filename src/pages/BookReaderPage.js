import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const BookReaderPage = () => {
  const { bookId, lang: currentLang, page: currentPage } = useParams();
  const navigate = useNavigate();
  const pageCache = useRef({});
  const pageInputRef = useRef(null);

  const [detailsInfo, setDetailsInfo] = useState(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let details = detailsInfo;
        if (!details) {
          const detailsResponse = await fetch(`/data/details/${bookId}.json`);
          if (!detailsResponse.ok) throw new Error('책 상세 정보를 찾을 수 없습니다.');
          details = await detailsResponse.json();
          if (!details.id) details.id = bookId;
          if (isActive) setDetailsInfo(details);
        }

        const pageNum = parseInt(currentPage, 10);
        if (pageNum > details.totalPages || pageNum < 1) {
          throw new Error('유효하지 않은 페이지입니다.');
        }

        const cacheKey = `${bookId}-${currentLang}-${currentPage}`;
        if (pageCache.current[cacheKey]) {
          if (isActive) setMarkdownContent(pageCache.current[cacheKey]);
        } else {
          const apiUrl = `/api/getPage?bookId=${bookId}&lang=${currentLang}&page=${currentPage}`;
          const pageResponse = await fetch(apiUrl);
          if (!pageResponse.ok) throw new Error('페이지 내용을 불러오는 데 실패했습니다.');
          const text = await pageResponse.text();

          if (isActive) {
            pageCache.current[cacheKey] = text;
            setMarkdownContent(text);
          }
        }
      } catch (err) {
        if (isActive) setError(err.message);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    loadData();

    return () => { isActive = false; };
  }, [bookId, currentLang, currentPage]);

  const goToPage = useCallback((pageNumber) => {
    const totalPages = detailsInfo ? detailsInfo.totalPages : 1;
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      navigate(`/read/${bookId}/${currentLang}/${pageNumber}`, { replace: true });
    }
  }, [bookId, currentLang, detailsInfo, navigate]);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (document.activeElement === pageInputRef.current) {
        return;
      }

      if (event.key === 'ArrowLeft') {
        goToPage(parseInt(currentPage, 10) - 1);
      }
      else if (event.key === 'ArrowRight') {
        goToPage(parseInt(currentPage, 10) + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, goToPage, pageInputRef]);

  const getTotalPages = () => {
    return detailsInfo ? detailsInfo.totalPages : 1;
  };



  const switchToLanguage = (targetLang) => {
    if (targetLang === currentLang) return;
    navigate(`/read/${bookId}/${targetLang}/${currentPage}`, { replace: true });
  };

  const handleJumpToPage = () => {
    const pageNum = parseInt(pageInputRef.current.value, 10);
    if (!isNaN(pageNum)) {
      goToPage(pageNum);
    }
  };


  const renderContent = () => {
    if (isLoading) return <div className="reader-loading">페이지를 불러오는 중...</div>;
    if (error) return <div className="reader-error">{error}</div>;

    return (
      <ReactMarkdown
        components={{ div: ({ node, ...props }) => <div className="markdown-body" {...props} /> }}
      >
        {markdownContent}
      </ReactMarkdown>
    );
  };

  return (
    <div className="reader-page-container">
      <main className="reader-main-content">
        {renderContent()}
      </main>

      <div className="reader-pagination-wrapper">
        <div className="pagination-controls">
          <button onClick={() => goToPage(parseInt(currentPage, 10) - 1)} disabled={currentPage <= 1}>
            이전
          </button>
          <span className="page-jumper">
            <input
              ref={pageInputRef}
              type="number"
              key={currentPage}
              defaultValue={currentPage}
              onKeyDown={(e) => { if (e.key === 'Enter') { handleJumpToPage(); e.target.blur(); } }}
              className="page-input"
              min="1"
              max={getTotalPages()}
            />
            <span className="page-total">/ {getTotalPages()}</span>
          </span>
          <button onClick={handleJumpToPage} className="jump-button">이동</button>
          <button onClick={() => goToPage(parseInt(currentPage, 10) + 1)} disabled={!detailsInfo || currentPage >= getTotalPages()}>
            다음
          </button>
        </div>

        <div className="language-switcher">
          <button onClick={() => switchToLanguage('kr')} className={currentLang === 'kr' ? 'active' : ''}>KR</button>
          <button onClick={() => switchToLanguage('source')} className={currentLang === 'source' ? 'active' : ''}>SOURCE</button>
        </div>
      </div>

      <footer className="bottom-ad-placeholder"></footer>
    </div>
  );
};

export default BookReaderPage;