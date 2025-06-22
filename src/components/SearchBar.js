import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchBar = ({ onSearch, initialText = '', initialTags = [], allAvailableTags = [] }) => {
  const [inputValue, setInputValue] = useState(initialText);
  const [selectedTags, setSelectedTags] = useState(initialTags);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    setInputValue(initialText);
  }, [initialText]);

  useEffect(() => {
    setSelectedTags(initialTags);
  }, [initialTags]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);


  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const lowerValue = value.toLowerCase().normalize('NFC');
    const filteredSuggestions = allAvailableTags
      .filter(tag => tag.toLowerCase().normalize('NFC').includes(lowerValue) && !selectedTags.includes(tag))
      .slice(0, 10);

    setSuggestions(filteredSuggestions);
    setShowSuggestions(filteredSuggestions.length > 0);
  };

  const handleAddTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      const newSelectedTags = [...selectedTags, tag];
      setSelectedTags(newSelectedTags);
    }
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    const newSelectedTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(newSelectedTags);
    onSearch({ textQuery: inputValue, selectedQueryTags: newSelectedTags });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch({ textQuery: inputValue, selectedQueryTags: selectedTags });
  };
  
  return (
    <form onSubmit={handleSubmit} ref={searchContainerRef} className="search-form">
      <div className="search-input-wrapper">
        <div className="search-input-container">
          {selectedTags.map(tag => (
            <span key={tag} className="tag-pill">
              #{tag}
              <button 
                type="button" 
                onClick={() => handleRemoveTag(tag)} 
                className="remove-tag-button"
                aria-label={`Remove tag ${tag}`}
              >
                <FaTimes />
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder={selectedTags.length > 0 ? "텍스트 추가 검색 또는 태그 검색" : "책, 저자, 태그 등으로 검색"}
            className="search-input"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => inputValue && suggestions.length > 0 && setShowSuggestions(true)}
          />
        </div>
        <button type="submit" className="search-button" aria-label="검색">
          <FaSearch />
        </button>
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="tag-suggestions">
          {suggestions.map(tag => (
            <li 
              key={tag} 
              onClick={() => handleAddTag(tag)}
              onMouseDown={(e) => e.preventDefault()} 
            >
              #{tag}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default SearchBar;