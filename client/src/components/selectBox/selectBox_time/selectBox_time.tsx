import React, { useState } from 'react';
import './selectBox_time.css';

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

function TimeSelectBox({ setSearchQuery }: Props) {
  const [clickedTimeSelect, setClickedTimeSelect] = useState(false);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const handleTimeSelect = () => {
    setClickedTimeSelect(!clickedTimeSelect);
  };
  return (
    <>
      <div
        className={
          'selectbox-time ' + (clickedTimeSelect ? 'btn-active' : null)
        }
      >
        <button className="selectbox-time-label" onClick={handleTimeSelect}>
          <p className="selectbox-time-selected-option">
            {selectedTime === null ? '시간' : `${selectedTime}시간`}
          </p>
        </button>
        <ul className="selectbox-time-optionList">
          {new Array(25).fill(null).map((_, idx) => (
            <li
              className="selectbox-time-option"
              id="time-selectBox"
              key={idx}
              onClick={() => {
                setClickedTimeSelect(false);
                setSelectedTime(idx);
                setSearchQuery((prevObj) => {
                  prevObj.time = idx;
                  return { ...prevObj };
                });
              }}
              onKeyPress={() => {
                setClickedTimeSelect(false);
                setSelectedTime(idx);
                setSearchQuery((prevObj) => {
                  prevObj.time = idx;
                  return { ...prevObj };
                });
              }}
              role="tab"
            >{`${idx}시간`}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default TimeSelectBox;
