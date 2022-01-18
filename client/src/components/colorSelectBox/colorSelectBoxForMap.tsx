import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducer';
import './colorSelectBoxForStore.css';

function ColorSelectBox() {
  const [clickedColorSelect, setClickedColorSelect] = useState(false);
  const [selectedColorId, setSelectedCorlorId] = useState('0');
  const handleColorSelect = () => {
    setClickedColorSelect(!clickedColorSelect);
  };
  const selectColor = (event: any) => {
    setSelectedCorlorId(event.target.id);
  };
  const colorUrls: any = useSelector(
    (state: RootState) => state.createRouteReducer.colorDotUrl,
  );
  return (
    <>
      <div
        className={
          'saveRouteModal-selectbox-color ' +
          (clickedColorSelect ? 'btn-active' : null)
        }
      >
        <button
          className="saveRouteModal-selectbox-color-label"
          onClick={handleColorSelect}
        >
          <img
            alt="selected-dot"
            className="saveRouteModal-selectbox-color-selected-option"
            src={colorUrls[Number(selectedColorId)]}
          />
        </button>
        <ul className="saveRouteModal-selectbox-color-optionList">
          {colorUrls.map((color: any, idx: number) => {
            const strArr = color.split('/');
            return (
              <li
                className="saveRouteModal-selectbox-color-option"
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
                  className="saveRouteModal-selectbox-color-img"
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
