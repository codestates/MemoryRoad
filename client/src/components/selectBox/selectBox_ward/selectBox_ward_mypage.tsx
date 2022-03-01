import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducer';
import './selectBox_ward.css';

function WardSelectBox({
  clickedWardSelect,
  handleWardSelect,
  selectedWard,
  selectWard,
}: any) {
  const wards = useSelector(
    (state: RootState): Array<string> => state.createRouteReducer.wards,
  );
  return (
    <>
      <div
        className={
          'selectbox-ward ' + (clickedWardSelect ? 'btn-active' : null)
        }
      >
        <button className="selectbox-ward-label" onClick={handleWardSelect}>
          <p className="selectbox-ward-selected-option">
            {selectedWard === '' ? '구를 선택해주세요' : selectedWard}
          </p>
        </button>
        <ul className="selectbox-ward-optionList">
          {wards.map((el, idx) => (
            <li
              className="selectbox-ward-option"
              id={el}
              key={idx}
              onClick={(event) => {
                selectWard(event);
                handleWardSelect();
              }}
              onKeyPress={selectWard}
              role="tab"
            >
              {el}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default WardSelectBox;
