import React, { createContext, useState, useEffect, useContext } from 'react';

const BookContext = createContext();

export const useBooks = () => {
  return useContext(BookContext);
};

export const BookProvider = ({ children }) => {
  const [allBooks, setAllBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/data/books.json')
      .then(res => res.json())
      .then(data => {
        setAllBooks(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching book data:", error);
        setIsLoading(false);
      });
  }, []);

  const value = {
    allBooks,
    isLoading,
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};