import React from 'react';
import './paginationSearch.css';

type Props = {
  cardCount: number;
  curPage: number;
  limit: number;
  setCurPage: React.Dispatch<React.SetStateAction<number>>;
};

function Pagination({ cardCount, curPage, limit, setCurPage }: Props) {
  //버튼의 수
  const buttonNum = Math.ceil(cardCount / limit);

  const handlepageButton = (clickedNum: number) => {
    setCurPage(clickedNum);
  };

  //랜더링할 버튼의 배열을 반환한다.
  function getButtons(): number[] {
    //그려야 하는 페이지 묶음
    const pageBundle = Math.floor((curPage - 1) / 5) + 1;

    const buttonAry: number[] = [];
    for (
      let i = (pageBundle - 1) * limit + 1;
      i <= Math.min(buttonNum, (pageBundle - 1) * limit + limit);
      i++
    ) {
      buttonAry.push(i);
    }

    return buttonAry;
  }

  const nextBtnImageUrl =
    'http://127.0.0.1:5500/client/public/img/next_button.png';
  const prevBtnImageUrl =
    'http://127.0.0.1:5500/client/public/img/prev_button .png';
  return (
    <>
      {/* 받아온 핀 카드를 나눠 페이지 네이션 구현. 최대 5장, 이상은 버튼을 눌러 다음 페이지로 이동하게해야한다. */}
      {/* server에서 받아온 숫자가 5를 넘어가면 버튼 활성화시키고, 버튼이 클릭되었을 때를 상태로 저장해놓고
                눌림다면, 이 페이지 네이션이 변경되도록 로직을 짜야한다. -> 페이지를 기억하고 있는 상태가 필요하겠는걸 ? ^-^ */}
      {/* 이전 버튼은 page가 1일때 숨긴다. page가 1이면 1/2/3/4/5 앞 순을 출력한다. 이후 버튼을 누르면 page를 2로 바꾸고(+1)
                아래 6/7/8/9/10 그 뒷 순을 출력한다. 이때 이전 버튼을 누르면 page를 1로바꾸는작업(-1) 상태를 변경해주면 또 그에 맞춰서
                1/2/3/4/5 가 렌더링된다 okok 페이지를 추적하는 상태가 있어야한다. 앞 버튼을 누르면 page-1 하고 뒷 버튼 누르면 page+1 음수는 배제하시구요. */}
      {/* 버튼을 클릭하면 그 id 에 해당하는 값으로 axios 요청을 보내 card 를 받아온다. 전체 카드 수는 언제나 요청에 담겨져 온다. */}
      <div
        className={
          curPage === 1
            ? 'myRouteStore-paginations-prev-btn-search unactive'
            : 'myRouteStore-paginations-prev-btn-search'
        }
        onClick={() => {
          setCurPage((prevPage) => prevPage - 1);
        }}
        onKeyDown={() => null}
        role="button"
        tabIndex={0}
      >
        <img
          alt="prevButton"
          className="myRouteStore-paginations-prev-img-search"
          src={prevBtnImageUrl}
        ></img>
      </div>
      {getButtons().map((btn) => (
        <button
          className={
            btn === curPage
              ? 'myRouteStore-paginations-page-btn-search active'
              : 'myRouteStore-paginations-page-btn-search'
          }
          key={btn}
          onClick={() => handlepageButton(btn)}
        >
          {btn}
        </button>
      ))}
      <div
        className={
          curPage === buttonNum
            ? 'myRouteStore-paginations-next-btn-search unactive'
            : 'myRouteStore-paginations-next-btn-search'
        }
        onClick={() => {
          setCurPage((prevPage) => prevPage + 1);
        }}
        onKeyDown={() => null}
        role="button"
        tabIndex={0}
      >
        <img
          alt="nextButton"
          className="myRouteStore-paginations-next-img-search"
          src={nextBtnImageUrl}
        ></img>
      </div>
    </>
  );
}

export default Pagination;
