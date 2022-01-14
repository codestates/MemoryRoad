import React, { useState } from 'react';
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
  const colors = [
    'http://127.0.0.1:5500/client/public/img/red_dot.png',
    'http://127.0.0.1:5500/client/public/img/orange_dot.png',
    'http://127.0.0.1:5500/client/public/img/yellow_dot.png',
    'http://127.0.0.1:5500/client/public/img/yellowGreen_dot.png',
    'http://127.0.0.1:5500/client/public/img/green_dot.png',
    'http://127.0.0.1:5500/client/public/img/sky_dot.png',
    'http://127.0.0.1:5500/client/public/img/blue_dot.png',
    'http://127.0.0.1:5500/client/public/img/purple_dot.png',
    'http://127.0.0.1:5500/client/public/img/pink_dot.png',
  ];
  const colorsName = [
    'red',
    'orange',
    'yellow',
    'yellowGreen',
    'green',
    'sky',
    'blue',
    'purple',
    'pink',
  ];
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
            src={colors[Number(selectedColorId)]}
          />
        </button>
        <ul className="saveRouteModal-selectbox-color-optionList">
          {colors.map((color, idx) => {
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
