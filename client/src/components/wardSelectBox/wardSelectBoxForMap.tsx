import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './wardSelectBox.css';

type Props = {
  setSearchQuery: React.Dispatch<
    React.SetStateAction<{
      rq?: string | undefined;
      lq?: string | undefined;
      location?: string | undefined;
      time?: number | undefined;
      page: number;
    }>
  >;
};

function WardSelectBox({ setSearchQuery }: Props) {
  const wards = [
    '강남구',
    '강동구',
    '강북구',
    '강서구',
    '관악구',
    '광진구',
    '구로구',
    '금천구',
    '노원구',
    '도봉구',
    '동대문구',
    '동작구',
    '마포구',
    '서대문구',
    '서초구',
    '성동구',
    '성북구',
    '송파구',
    '양천구',
    '영등포구',
    '용산구',
    '은평구',
    '종로구',
    '중구',
    '중랑구',
  ];
  const [clickedWardSelect, setClickedWardSelect] = useState(false);
  const [selectedWard, setSelectedWard] = useState('0');
  const handleWardSelect = () => {
    setClickedWardSelect(!clickedWardSelect);
  };
  const selectWard = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    //형변환
    const target = event.target as HTMLElement;
    setSelectedWard(target.id);
    setSearchQuery((prev) => {
      prev.page = 1;
      prev.location = target.id;
      return { ...prev };
    });
  };

  return (
    <>
      <div
        className={
          'selectbox-ward map ' + (clickedWardSelect ? 'btn-active' : null)
        }
      >
        <button className="selectbox-ward-label" onClick={handleWardSelect}>
          <p className="selectbox-ward-selected-option">
            {selectedWard === '0' ? '구를 선택해주세요' : selectedWard}
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
              onKeyPress={() => null}
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
