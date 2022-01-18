import React, { useState } from 'react';
import { Route } from '../../types/searchRoutesTypes';
import './colorSelectBox.css';

type Props = {
  setColorIdx: React.Dispatch<React.SetStateAction<number>>;
  setAllRoutes: React.Dispatch<React.SetStateAction<Array<Route>>>;
  findAllRoute: any;
};

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

function ColorSelectBox({ setColorIdx, setAllRoutes, findAllRoute }: Props) {
  const [clickedColorSelect, setClickedColorSelect] = useState(false);
  const [selectedColorId, setSelectedCorlorId] = useState('0');
  const handleColorSelect = () => {
    setClickedColorSelect(!clickedColorSelect);
  };
  const selectColor = (event: any) => {
    setSelectedCorlorId(event.target.id);
  };

  //조건에 맞는 루트 배열을 state값에 저장한다.
  async function getAllRoute(colorIdx: number) {
    if (colorIdx === 9) {
      setAllRoutes(findAllRoute);
    } else {
      const routeColor = colorsName[colorIdx];
      const colorFilterRoutes = [];
      for (let i = 0; i < findAllRoute.length; i++) {
        if (routeColor === findAllRoute[i].color) {
          colorFilterRoutes.push(findAllRoute[i]);
        }
      }
      setAllRoutes(colorFilterRoutes);
    }
  }

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
  return (
    <>
      <div
        className={
          'selectbox-color ' + (clickedColorSelect ? 'btn-active' : null)
        }
      >
        <button className="selectbox-color-label" onClick={handleColorSelect}>
          <img
            alt="selected-dot"
            className="selectbox-color-selected-option"
            src={colors[Number(selectedColorId)]}
          />
        </button>
        <ul className="selectbox-color-optionList">
          {colors.map((color, idx) => {
            const strArr = color.split('/');
            return (
              <li
                className="selectbox-color-option"
                id={String(idx)}
                key={idx}
                onClick={(event) => {
                  selectColor(event);
                  handleColorSelect();
                  setColorIdx(idx);
                  getAllRoute(idx);
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
