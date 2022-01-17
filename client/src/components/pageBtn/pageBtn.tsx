import React, { useState } from 'react';
import './pageBtn.css';

type Props = {
  curPage: number;
  cardCount: number;
  limit: number;
  setCurPage: React.Dispatch<React.SetStateAction<number>>;
};

function PageBtn({ curPage, cardCount, limit, setCurPage }: Props) {
  //버튼의 수
  const buttonNum = Math.ceil(cardCount / limit);

  const handlepageButton = (clickedNum: number) => {
    setCurPage(clickedNum);
  };

  return (
    <>
      <div className="page-button-container">
        <i className="fas fa-angle-double-left"></i>
        {new Array(Math.min(buttonNum, 5)).fill(null).map((_, idx) => (
          <button
            className={
              idx + 1 !== curPage ? 'page-button unactive' : 'page-button'
            }
            key={idx + 1}
            onClick={() => handlepageButton(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <i className="fas fa-angle-double-right"></i>
      </div>
    </>
  );
}
export default PageBtn;
