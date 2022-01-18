import React, { useState } from 'react';
import './seoulSelectBox.css';

function SeoulSelectBox() {
  const [clickedSeoulSelect, setClickedSeoulSelect] = useState(false);
  const [selectedSeoul, setSelectedSeoul] = useState('0');
  const handleSeoulSelect = () => {
    setClickedSeoulSelect(!clickedSeoulSelect);
  };
  const selectSeoul = (event: any) => {
    setSelectedSeoul(event.target.id);
  };
  return (
    <>
      <div
        className={
          'selectbox-seoul map ' + (clickedSeoulSelect ? 'btn-active' : null)
        }
      >
        <button className="selectbox-seoul-label" onClick={handleSeoulSelect}>
          <p className="selectbox-seoul-selected-option">서울특별시</p>
        </button>
        <ul className="selectbox-seoul-optionList">
          <li
            className="selectbox-seoul-option"
            id="seoul-selectBox"
            key="0"
            onClick={(event) => {
              selectSeoul(event);
              handleSeoulSelect();
            }}
            onKeyPress={selectSeoul}
            role="tab"
          >
            서울특별시
          </li>
        </ul>
      </div>
    </>
  );
}

export default SeoulSelectBox;
