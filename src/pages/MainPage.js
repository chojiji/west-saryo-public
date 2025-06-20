import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBooks } from '../contexts/BookContext';
import SearchBar from '../components/SearchBar';
import BookList from '../components/BookList';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 10;

const MainPage = () => {
  const { allBooks, isLoading } = useBooks();
  const [sortedBooks, setSortedBooks] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    if (allBooks && allBooks.length > 0) {
      const sorted = [...allBooks].sort((a, b) =>
        a.title_ko.localeCompare(b.title_ko)
      );
      setSortedBooks(sorted);
    }
  }, [allBooks]);

  const filteredBooks = (sortedBooks || []).filter(book => {
    if (!searchTerm) return true;
    const lowercasedQuery = searchTerm.toLowerCase().normalize('NFC');
    return (
      book.title_ko.normalize('NFC').toLowerCase().includes(lowercasedQuery) ||
      book.author_ko.normalize('NFC').toLowerCase().includes(lowercasedQuery) ||
      book.tags.some(tag => tag.normalize('NFC').toLowerCase().includes(lowercasedQuery))
    );
  });

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentDisplayBooks = filteredBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearch = useCallback((query) => {
    const newParams = new URLSearchParams(searchParams);

    if (query) {
      newParams.set('q', query);
    } else {
      newParams.delete('q');
    }

    newParams.delete('page');

    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      const newParams = new URLSearchParams(searchParams);

      if (pageNumber === 1) {
        newParams.delete('page');
      } else {
        newParams.set('page', String(pageNumber));
      }

      setSearchParams(newParams);
    }
  };

  const renderResultsCount = () => {
    if (isLoading) return <p className="results-count">책 목록을 불러오는 중...</p>;

    const totalItems = filteredBooks.length;
    if (totalItems === 0) return <p className="results-count">표시할 책이 없습니다.</p>;

    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = startItem + currentDisplayBooks.length - 1;

    return (
      <p className="results-count">
        {`${startItem} - ${endItem} / 총 ${totalItems}권`}
      </p>
    );
  };

  return (
    <div className="page-wrapper">
      <main className="main-content">
        <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
        {renderResultsCount()}
        <BookList books={currentDisplayBooks} isLoading={isLoading} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
};

export default MainPage;