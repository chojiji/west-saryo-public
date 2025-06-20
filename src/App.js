// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookProvider } from './contexts/BookContext';
import MainPage from './pages/MainPage';
import Header from './components/Header'; 
import AboutPage from './pages/AboutPage';
import BookInfoPage from './pages/BookInfoPage';
import BookReaderPage from './pages/BookReaderPage';
import './styles/App.css';

function App() {
  return (
    <BookProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/book/:bookId" element={<BookInfoPage />} />
            <Route path="/read/:bookId/:lang/:page" element={<BookReaderPage />} />
          </Routes>
        </div>
      </Router>
    </BookProvider>
  );
}

export default App;