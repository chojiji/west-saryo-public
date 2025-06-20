import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="site-header">
    <Link to="/" className="header-link">
      <h1>서양사 기계 번역소</h1>
    </Link>
    <nav className="header-nav">
      <Link to="/about" className="header-nav-link">소개</Link>
    </nav>
  </header>
);

export default Header;