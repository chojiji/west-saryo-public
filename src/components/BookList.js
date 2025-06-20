import { Link } from 'react-router-dom';
import BookCard from './BookCard';

const BookList = ({ books, isLoading }) => {
  return (
    <div className="book-list">
      {books.map((book) => (
        <Link key={book.id} to={`/book/${book.id}`} className="book-card-link">
          <BookCard book={book} />
        </Link>
      ))}
    </div>
  );
};

export default BookList;