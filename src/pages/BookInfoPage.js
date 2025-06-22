import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBooks } from '../contexts/BookContext';

const BookInfoPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const { allBooks, isLoading: isListLoading } = useBooks();

  const [detailsInfo, setDetailsInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (isListLoading) {
      return;
    }

    const baseInfo = allBooks.find(b => b.id === bookId);
    if (!baseInfo) {
      navigate('/');
      return;
    }

    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/data/details/${bookId}.json`);
        if (!response.ok) throw new Error('Book details not found');
        const data = await response.json();
        setDetailsInfo(data);
      } catch (error) {
        console.error("Failed to load book details:", error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [bookId, allBooks, isListLoading, navigate]);

  if (isLoading || isListLoading) {
    return <div className="page-loading">정보를 불러오는 중...</div>;
  }

  const baseInfo = allBooks.find(b => b.id === bookId);

  if (!baseInfo || !detailsInfo) {
    return <div>책 정보를 찾을 수 없습니다.</div>;
  }

  const imageUrl = `/images/${baseInfo.id}.webp`;
  const startPage = detailsInfo.startPage || 1;

  return (
    <div className="book-info-container">
      <div className="book-info-layout">
        <div className="book-info-left">
          <img src={imageUrl} alt={baseInfo.title_ko} className="book-info-image" />
          <Link to={`/read/${baseInfo.id}/kr/${startPage}`} className="read-button">
            읽기
          </Link>
          <Link to={detailsInfo.sourceUrl} className="read-button">
            판본 링크
          </Link>
        </div>
        <div className="book-info-right">
          <h1 className="book-info-title">{baseInfo.title_ko}</h1>
          <p className="book-info-title-original">{baseInfo.title_original}</p>

          <div className="info-section">
            <span className="info-label">원전 저자</span>
            <span className="info-value">{baseInfo.author_ko} ({baseInfo.author_original})</span>
          </div>
          <div className="info-section">
            <span className="info-label">원전 언어</span>
            <span className="info-value">{detailsInfo.language_original}</span>
          </div>
          <br />
          <div className="info-section">
            <span className="info-label">판본 저자</span>
            <span className="info-value">{detailsInfo.author_edition}</span>
          </div>
          <div className="info-section">
            <span className="info-label">판본 언어</span>
            <span className="info-value">{detailsInfo.language_edition}</span>
          </div>


          <div className="info-section tags-section">
            {baseInfo.tags.map(tag => (
              <Link
                key={tag}
                to={`/?tags=${tag}`}
                className="info-tag"
              >
                #{tag}
              </Link>
            ))}
          </div>

          <div className="info-section">
            <p className="book-info-description">{detailsInfo.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookInfoPage;