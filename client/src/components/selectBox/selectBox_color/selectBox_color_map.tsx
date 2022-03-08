import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducer';
import { Route } from '../../../types/searchRoutesTypes';
import './selectBox_color.css';

type Props = {
  setColorIdx: React.Dispatch<React.SetStateAction<number>>;
  setAllRoutes: React.Dispatch<React.SetStateAction<Route[] | null>>;
  findAllRoute: Route[] | null;
};

function ColorSelectBox({ setColorIdx, setAllRoutes, findAllRoute }: Props) {
  const [clickedColorSelect, setClickedColorSelect] = useState(false);
  const [selectedColorId, setSelectedCorlorId] = useState('0');
  const handleColorSelect = () => {
    setClickedColorSelect(!clickedColorSelect);
  };
  const selectColor = (event: any) => {
    setSelectedCorlorId(event.target.id);
  };
  const dispatch = useDispatch();

  const colorUrls: any = useSelector(
    (state: RootState) => state.createRouteReducer.whiteColorUrl,
  );
  const colorsName: any = useSelector(
    (state: RootState) => state.createRouteReducer.colorName,
  );

  //조건에 맞는 루트 배열을 state값에 저장한다.
  async function getAllRoute(colorIdx: number) {
    if (colorIdx === 0) {
      setAllRoutes(findAllRoute);
    } else {
      const routeColor = colorsName[colorIdx];
      const colorFilterRoutes = [];
      if (findAllRoute === null) {
        return;
      }
      for (let i = 0; i < findAllRoute.length; i++) {
        if (routeColor === findAllRoute[i].color) {
          colorFilterRoutes.push(findAllRoute[i]);
        }
      }
      setAllRoutes(colorFilterRoutes);
    }
  }

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
            src={colorUrls[Number(selectedColorId)]}
          />
        </button>
        <ul className="selectbox-color-optionList">
          {colorUrls.map((color: any, idx: any) => {
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
                // 필터링을 거치는 함수를 onClick이벤트로 주게됨
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
