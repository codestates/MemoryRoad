import React, { useState } from 'react';
import './searchPinBar.css';

interface props {
  getSearchText: (text: string) => void;
  handleIsModalOpen: (boolean: boolean) => void;
  handleBlueMarker: (boolean: boolean) => void;
  handleGrayMarker: (boolean: boolean) => void;
}

function SearchPinBar({
  getSearchText,
  handleBlueMarker,
  handleIsModalOpen,
  handleGrayMarker,
}: props): any {
  // 검색어 상태
  const [searchText, setSearchText] = useState('');
  const handleSearchBar = (event: { target: HTMLInputElement }): void => {
    // 타입 정의 미쳤네 ..
    const text = event.target.value;
    setSearchText(text);
  };
  return (
    <>
      <div id="searchPin-static-location-sy">
        <div id="searchPin-background">
          <button
            id="searchPin-my-blue-marker-btn"
            onClick={() => {
              handleBlueMarker(true);
              handleGrayMarker(false);
            }}
          >
            <img
              alt="blue_marker"
              id="searchPin-my-blue-marker-img"
              src="https://server.memory-road.net/upload/blue_marker.png"
            ></img>
          </button>
          <div id="searchPin-container-sy">
            <input
              className="searchPin-input"
              onChange={handleSearchBar}
              placeholder="원하는 장소를 검색해보세요 !"
              type="text"
            />
            <button
              className="searchPin-search-btn"
              onClick={() => {
                getSearchText(searchText);
                handleIsModalOpen(false);
                handleBlueMarker(false);
                handleGrayMarker(true);
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
