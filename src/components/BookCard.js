import React from 'react';

const BookCard = ({ book }) => (
  <div className="book-card">
    <img src={`/images/${book.id}.webp`} alt={book.title_ko} className="book-card-image" />
    <div className="book-card-info">
      <h3 className="book-card-title">{book.title_ko}</h3>
      <p className="book-card-author">{book.author_original}</p>
      <div className="book-card-tags">
        {book.tags.slice(0, 3).map(tag => (
          <span key={tag} className="book-card-tag">#{tag}</span>
        ))}
      </div>
    </div>
  </div>
);

export default BookCard;