import React from 'react';
import './pagination.css';

function Pagination({
  handleClickedPageNum,
  dividedPages,
  paginationNum,
  handleNextPaginationNum,
  handlePrevPaginationNum,
}: any) {
  return (
    <>
      {/* 받아온 핀 카드를 나눠 페이지 네이션 구현. 최대 5장, 이상은 버튼을 눌러 다음 페이지로 이동하게해야한다. */}
      {/* server에서 받아온 숫자가 5를 넘어가면 버튼 활성화시키고, 버튼이 클릭되었을 때를 상태로 저장해놓고
                눌림다면, 이 페이지 네이션이 변경되도록 로직을 짜야한다. -> 페이지를 기억하고 있는 상태가 필요하겠는걸 ? ^-^ */}
      {/* 이전 버튼은 page가 1일때 숨긴다. page가 1이면 1/2/3/4/5 앞 순을 출력한다. 이후 버튼을 누르면 page를 2로 바꾸고(+1)
                아래 6/7/8/9/10 그 뒷 순을 출력한다. 이때 이전 버튼을 누르면 page를 1로바꾸는작업(-1) 상태를 변경해주면 또 그에 맞춰서
                1/2/3/4/5 가 렌더링된다 okok 페이지를 추적하는 상태가 있어야한다. 앞 버튼을 누르면 page-1 하고 뒷 버튼 누르면 page+1 음수는 배제하시구요. */}
      {/* 버튼을 클릭하면 그 id 에 해당하는 값으로 axios 요청을 보내 card 를 받아온다. 전체 카드 수는 언제나 요청에 담겨져 온다. */}
      {paginationNum - 1 < 0 ? null : (
        <button
          className="myRouteStore-paginations-prev-btn"
          onClick={handlePrevPaginationNum}
        ></button>
      )}
      {dividedPages[paginationNum].map((el: any, idx: any) => (
        <button
          className="myRouteStore-paginations-page-btn"
          id={paginationNum * 5 + idx + 1}
          key={paginationNum * 5 + idx}
          onClick={() => handleClickedPageNum(paginationNum * 5 + (idx + 1))}
        >
          {paginationNum * 5 + (idx + 1)}
        </button>
      ))}
      {/* div 태그 button 태그로 치환하기. */}
      {dividedPages[paginationNum + 1] === undefined ? null : (
        <button
          className="myRouteStore-paginations-next-btn"
          onClick={handleNextPaginationNum}
        ></button>
      )}
    </>
  );
}

export default Pagination;
