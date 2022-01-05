import React, { useState } from 'react';
import './searchPinBar.css';

interface props {
  getSearchText: (text: string) => void;
  handleIsModalOpen: (boolean: boolean) => void;
}

function SearchPinBar({ getSearchText, handleIsModalOpen }: props): any {
  // 검색어 상태
  const [searchText, setSearchText] = useState('');
  const handleSearchBar = (event: { target: HTMLInputElement }): void => {
    // 타입 정의 미쳤네 ..
    const text = event.target.value;
    setSearchText(text);
  };
  return (
    <>
      <div id="searchPin-static-location">
        <div id="searchPin-background">
          <div id="searchPin-container">
            <input
              className="searchPin-input"
              onChange={handleSearchBar}
              type="text"
            />
            <button
              className="searchPin-search-btn"
              onClick={() => {
                getSearchText(searchText);
                handleIsModalOpen(false);
              }}
            >
              검색
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchPinBar;
