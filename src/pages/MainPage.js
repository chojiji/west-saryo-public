import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBooks } from '../contexts/BookContext';
import SearchBar from '../components/SearchBar';
import BookList from '../components/BookList';
import Pagination from '../components/Pagination';

const SORT_BY_TITLE = 'title';
const SORT_BY_DATE = 'date';
const SORT_BY_ADDED = 'added';

const SORT_DIRECTION_ASC = 'asc';
const SORT_DIRECTION_DESC = 'desc';

const ITEMS_PER_PAGE = 10;

const sortBooks = (books, sortKey, sortDirection) => {
  if (!books || books.length === 0) {
    return [];
  }

  return [...books].sort((a, b) => {
    let comparison = 0;
    
    if (sortKey === SORT_BY_TITLE) {
      comparison = a.title_ko.localeCompare(b.title_ko);
    } else if (sortKey === SORT_BY_DATE) {
      const dateA = a.circa_original_written || (sortDirection === SORT_DIRECTION_ASC ? Infinity : -Infinity);
      const dateB = b.circa_original_written || (sortDirection === SORT_DIRECTION_ASC ? Infinity : -Infinity);
      comparison = dateA - dateB;
    } else if (sortKey === SORT_BY_ADDED) {
      const dateA = new Date(a.date_added);
      const dateB = new Date(b.date_added);
      comparison = dateA - dateB;
    }
    return sortDirection === SORT_DIRECTION_ASC ? comparison : -comparison;
  });
};

const MainPage = () => {
  const { allBooks, isLoading } = useBooks();
  const [sortedBooks, setSortedBooks] = useState([]);
  const [allUniqueTags, setAllUniqueTags] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get('q') || '';
  const searchTags = (searchParams.get('tags') || '').split(',').filter(Boolean);
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const initialSortKey = searchParams.get('sort_by') || SORT_BY_TITLE;
  const initialSortDirection = searchParams.get('sort_dir') || SORT_DIRECTION_ASC;

  const [currentSortKey, setCurrentSortKey] = useState(initialSortKey);
  const [currentSortDirection, setCurrentSortDirection] = useState(initialSortDirection);

  useEffect(() => {
    if (allBooks && allBooks.length > 0) {
      const newlySortedBooks = sortBooks(allBooks, currentSortKey, currentSortDirection);
      setSortedBooks(newlySortedBooks);
      const uniqueTagsSet = new Set();
      allBooks.forEach(book => {
        book.tags.forEach(tag => uniqueTagsSet.add(tag.normalize('NFC')));
      });
      setAllUniqueTags(Array.from(uniqueTagsSet).sort());
    } else {
      setSortedBooks([]);
    }
  }, [allBooks, currentSortKey, currentSortDirection]);

  const filteredBooks = (sortedBooks || []).filter(book => {
    const lowercasedQuery = searchTerm.toLowerCase().normalize('NFC');
    
    const matchesText = !searchTerm || (
      book.title_ko.normalize('NFC').toLowerCase().includes(lowercasedQuery) ||
      book.author_ko.normalize('NFC').toLowerCase().includes(lowercasedQuery)
    );

    const matchesTags = searchTags.length === 0 || 
      searchTags.every(st => 
        book.tags.some(bt => bt.normalize('NFC').toLowerCase() === st.toLowerCase())
      );

    return matchesText && matchesTags;
  });

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentDisplayBooks = filteredBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearch = useCallback(({ textQuery, selectedQueryTags }) => {
    const newParams = new URLSearchParams(searchParams);

    if (textQuery) {
      newParams.set('q', textQuery);
    } else {
      newParams.delete('q');
    }

    if (selectedQueryTags && selectedQueryTags.length > 0) {
      newParams.set('tags', selectedQueryTags.join(','));
    } else {
      newParams.delete('tags');
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

  const handleSort = useCallback((sortKey) => {
    let newDirection = SORT_DIRECTION_ASC;
    if (currentSortKey === sortKey) {
      newDirection = currentSortDirection === SORT_DIRECTION_ASC ? SORT_DIRECTION_DESC : SORT_DIRECTION_ASC;
    }

    setCurrentSortKey(sortKey);
    setCurrentSortDirection(newDirection);

    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort_by', sortKey);
    newParams.set('sort_dir', newDirection);
    newParams.delete('page');
    setSearchParams(newParams);
  }, [currentSortKey, currentSortDirection, searchParams, setSearchParams]);

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
        <SearchBar 
          onSearch={handleSearch} 
          initialText={searchTerm}
          initialTags={searchTags}
          allAvailableTags={allUniqueTags} 
        />
        <div className="results-and-sort">
          {renderResultsCount()}
          <div className="sort-controls">
            <span className="sort-label">정렬:</span>
            <button
              className={`sort-option ${currentSortKey === SORT_BY_TITLE ? 'active-sort' : ''}`}
              onClick={() => handleSort(SORT_BY_TITLE)}
            >
              제목순
              {currentSortKey === SORT_BY_TITLE && (
                <span className="sort-icon">
                  {currentSortDirection === SORT_DIRECTION_ASC ? ' ▲' : ' ▼'}
                </span>
              )}
            </button>
            <button
              className={`sort-option ${currentSortKey === SORT_BY_DATE ? 'active-sort' : ''}`}
              onClick={() => handleSort(SORT_BY_DATE)}
            >
              연도순
              {currentSortKey === SORT_BY_DATE && (
                <span className="sort-icon">
                  {currentSortDirection === SORT_DIRECTION_ASC ? ' ▲' : ' ▼'}
                </span>
              )}
            </button>
            <button
              className={`sort-option ${currentSortKey === SORT_BY_ADDED ? 'active-sort' : ''}`}
              onClick={() => handleSort(SORT_BY_ADDED)}
            >
              등록순
              {currentSortKey === SORT_BY_ADDED && (
                <span className="sort-icon">
                  {currentSortDirection === SORT_DIRECTION_ASC ? ' ▲' : ' ▼'}
                </span>
              )}
            </button>
          </div>
        </div>
        
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