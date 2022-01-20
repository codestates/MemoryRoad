import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from './../../redux/reducer/index';
import axios from 'axios';
import './saveRouteModal.css';
import { addPinImageFiles } from '../../redux/actions';

function SaveRouteModal({
  handleSidebarSaveBtn,
  pins,
  totalTime,
  pinImage,
  setIsMoveToMypage,
  setIsNotUserSave,
}: any) {
  const rawData: any = localStorage.getItem('persist:root');
  const parsedData = JSON.parse(rawData).setUserInfoReducer;
  const userInfo = JSON.parse(parsedData).userInfo;
  const { isLogin } = userInfo;
  console.log(pinImage);
  const colorUrls: any = useSelector(
    (state: RootState) => state.createRouteReducer.colorDotUrl,
  );
  const colorNames: any = useSelector(
    (state: RootState) => state.createRouteReducer.colorName,
  );

  const [clickedColorSelect, setClickedColorSelect] = useState(false);
  const [clickedDaySelect, setClickedDaySelect] = useState(false);
  const [clickedMonthSelect, setClickedMonthSelect] = useState(false);
  const [clickedYearSelect, setClickedYearSelect] = useState(false);
  const [selectedColorId, setSelectedCorlorId] = useState('0');
  const [selectedDay, setSelectedDay] = useState('0');
  const [selectedMonth, setSelectedMonth] = useState('0');
  const [selectedYear, setSelectedYear] = useState('0');

  const handleColorSelect = () => {
    setClickedColorSelect(!clickedColorSelect);
    setClickedDaySelect(false);
    setClickedMonthSelect(false);
    setClickedYearSelect(false);
  };
  const selectColor = (event: any) => {
    setSelectedCorlorId(event.target.id);
  };
  const handleDaySelect = () => {
    setClickedDaySelect(!clickedDaySelect);
    setClickedColorSelect(false);
    setClickedMonthSelect(false);
    setClickedYearSelect(false);
  };
  const selectDay = (event: any) => {
    setSelectedDay(event.target.id);
  };
  const handleMonthSelect = () => {
    setClickedMonthSelect(!clickedMonthSelect);
    setClickedColorSelect(false);
    setClickedDaySelect(false);
    setClickedYearSelect(false);
  };
  const selectMonth = (event: any) => {
    setSelectedMonth(event.target.id);
  };
  const handleYearSelect = () => {
    setClickedYearSelect(!clickedYearSelect);
    setClickedMonthSelect(false);
    setClickedColorSelect(false);
    setClickedDaySelect(false);
  };
  const selectYear = (event: any) => {
    setSelectedYear(event.target.id);
  };
  const [routeTitle, setRouteTitle] = useState('');
  const [routeDesc, setRouteDesc] = useState('');
  const [isOpenRoute, setIsOpenRoute] = useState(false);

  const handleRouteTitle = (event: any) => {
    setRouteTitle(event.target.value);
  };
  const handleRouteDesc = (event: any) => {
    setRouteDesc(event.target.value);
  };
  const handleRouteOpenOrUnopen = () => {
    setIsOpenRoute(!isOpenRoute);
  };

  /* 저장 버튼 눌렀을 때 일어나는 이벤트 */
  const saveAllPinAndRouteInfo = () => {
    if (
      routeTitle.length &&
      routeDesc.length &&
      Number(selectedYear) &&
      Number(selectedMonth) &&
      Number(selectedDay)
    ) {
      if (isLogin) {
        const translatedPins = pins.slice(1);
        translatedPins.forEach((el: any) => {
          // delete el.pinID; 내가 지워서 자꾸 오류를 일으켰구나 ..
          el.keywords = [];
        });

        const data = {
          routeName: routeTitle,
          description: routeDesc,
          public: !isOpenRoute,
          time: totalTime,
          color: colorNames[Number(selectedColorId)],
          date: `${selectedYear}-${selectedMonth}-${selectedDay}`,
          pins: translatedPins,
        };

        console.log(data);

        const formData = new FormData();
        formData.append('route', JSON.stringify(data));
        pinImage.forEach((el: any) => {
          formData.append(`${el.ranking}`, el.files);
        });

        axios({
          url: 'https://server.memory-road.net/routes',
          method: 'post',
          data: formData,
          withCredentials: true,
        })
          .then((res) => {
            if (res.status === 201) {
              console.log(res);
              handleSidebarSaveBtn(false);
              setIsMoveToMypage(true);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        handleSidebarSaveBtn(false);
        setIsNotUserSave(true);
      }
    }
  };
  return (
    <>
      <div className="saveRouteModal-background">
        <div className="saveRouteModal-container">
          <div className="saveRouteModal-content">
            <p className="saveRouteModal-text">루트를 저장하시겠습니까 ?</p>
            <div className="saveRouteModal-selectZone">
              {/* ------------------------------------------------------ */}
              <div
                className={
                  'saveRouteModal-selectbox-year ' +
                  (clickedYearSelect ? 'btn-active' : null)
                }
              >
                <button
                  className="saveRouteModal-selectbox-year-label"
                  onClick={handleYearSelect}
                >
                  <p className="saveRouteModal-selectbox-year-selected-option">
                    {Number(selectedYear) === 0 ? '년도' : Number(selectedYear)}
                  </p>
                </button>
                <ul className="saveRouteModal-selectbox-year-optionList">
                  {new Array(100).fill(0).map((el, idx) => (
                    <li
                      className="saveRouteModal-selectbox-year-option"
                      id={String(2022 - idx)}
                      key={idx}
                      onClick={(event) => {
                        selectYear(event);
                        handleYearSelect();
                      }}
                      onKeyPress={selectYear}
                      role="tab"
                    >
                      {2022 - idx}
                    </li>
                  ))}
                </ul>
              </div>
              {/* ------------------------------------------------------ */}
              <div
                className={
                  'saveRouteModal-selectbox-month ' +
                  (clickedMonthSelect ? 'btn-active' : null)
                }
              >
                <button
                  className="saveRouteModal-selectbox-month-label"
                  onClick={handleMonthSelect}
                >
                  <p className="saveRouteModal-selectbox-month-selected-option">
                    {Number(selectedMonth) === 0
                      ? '월'
                      : Number(selectedMonth) + 1}
                  </p>
                </button>
                <ul className="saveRouteModal-selectbox-month-optionList">
                  {new Array(12).fill(0).map((el, idx) => (
                    <li
                      className="saveRouteModal-selectbox-month-option"
                      id={String(idx)}
                      key={idx}
                      onClick={(event) => {
                        selectMonth(event);
                        handleMonthSelect();
                      }}
                      onKeyPress={selectMonth}
                      role="tab"
                    >
                      {idx + 1}
                    </li>
                  ))}
                </ul>
              </div>
              {/* ------------------------------------------------------ */}
              <div
                className={
                  'saveRouteModal-selectbox-day ' +
                  (clickedDaySelect ? 'btn-active' : null)
                }
              >
                <button
                  className="saveRouteModal-selectbox-day-label"
                  onClick={handleDaySelect}
                >
                  <p className="saveRouteModal-selectbox-day-selected-option">
                    {Number(selectedDay) === 0 ? '일' : Number(selectedDay) + 1}
                  </p>
                </button>
                <ul className="saveRouteModal-selectbox-day-optionList">
                  {new Array(31).fill(0).map((el, idx) => (
                    <li
                      className="saveRouteModal-selectbox-day-option"
                      id={String(idx)}
                      key={idx}
                      onClick={(event) => {
                        selectDay(event);
                        handleDaySelect();
                      }}
                      onKeyPress={selectDay}
                      role="tab"
                    >
                      {idx + 1}
                    </li>
                  ))}
                </ul>
              </div>
              {/* ------------------------------------------------------ */}
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
                  {colorUrls.map((color: any, idx: any) => {
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
            </div>
            <textarea
              className="saveRouteModal-route-title-input"
              onChange={handleRouteTitle}
              placeholder="루트의 제목을 입력해주세요."
            ></textarea>
            <textarea
              className="saveRouteModal-route-content-input"
              onChange={handleRouteDesc}
              placeholder="루트에 대한 간단함 감상을 적어보세요."
            ></textarea>
            <div className="saveRouteModal-open-unopen">
              🔐
              <label className="saveRouteModal-switch">
                <input onClick={handleRouteOpenOrUnopen} type="checkbox" />
                <span className="saveRouteModal-slider-circle"></span>
              </label>
            </div>
            <button
              className="saveRouteModal-save-btn"
              onClick={() => saveAllPinAndRouteInfo()}
            >
              루트 저장
            </button>
            <button
              className="saveRouteModal-close-btn"
              onClick={() => handleSidebarSaveBtn(false)}
            >
              조금 더 생각해볼게요
            </button>
          </div>
          <p className="saveRouteModal-last-text">MeMoryRoad</p>
        </div>
      </div>
    </>
  );
}

export default SaveRouteModal;
