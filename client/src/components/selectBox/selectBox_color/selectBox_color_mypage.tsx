import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducer';
import './selectBox_color.css';

function ColorSelectBox({
  clickedColorSelect,
  handleColorSelect,
  selectedColorId,
  selectColor,
}: any) {
  const colorUrls: any = useSelector(
    (state: RootState) => state.createRouteReducer.colorDotUrl,
  );
  return (
    <>
      <div
        className={
          'selectbox-color ' + (clickedColorSelect ? 'btn-active' : null)
        }
      >
        <button className="selectbox-color-label" onClick={handleColorSelect}>
          {/* 기본값으로 회색 이미지 넣기 */}
          <img
            alt="selected-dot"
            className="selectbox-color-selected-option"
            src={colorUrls[Number(selectedColorId)]}
          />
        </button>
        <ul className="selectbox-color-optionList">
          {colorUrls.map((color: any, idx: number) => {
            const strArr = color.split('/');
            return (
              <li
                className="selectbox-color-option"
                id={String(idx)}
                key={idx}
                onClick={(event) => {
                  selectColor(event);
                  handleColorSelect();
                }}
                onKeyPress={selectColor}
                role="tab"
              >
                <img
                  alt={strArr[6]}
                  className="selectbox-color-img"
                  id={String(idx)}
                  src={color}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default ColorSelectBox;
