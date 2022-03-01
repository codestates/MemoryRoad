import React, { useState, useEffect } from 'react';

// export function useScroll(height: number) {
//   const [scrollY, setScrollY] = useState<number>(0);

//   useEffect(() => {
//     let mounted = true;
//     let timer: any = null;
//     window.addEventListener('scroll', () => {
//       if (mounted) {
//         // useEffect 안에서 setTimeout이 한번만 동작하도록 제한.
//         clearTimeout(timer);
//         timer = setTimeout(() => {
//           // console.log('스크롤 이벤트 시작');

//           setScrollY(window.pageYOffset);
//         }, 100);
//       }
//     });
//     // useEffect에서 return function은
//     // component가 unmount될 때 실행되는 callback function이다!
//     return () => {
//       // console.log('스크롤 이벤트 종료');
//       mounted = false;
//     };
//   });
//   return {
//     scrollY,
//   };
// }

// 브라우저 전-체 높이 구하기
// function getHeight() {
//   return Math.max(
//     document.body.scrollHeight,
//     document.documentElement.scrollHeight,
//     document.body.offsetHeight,
//     document.documentElement.offsetHeight,
//     document.body.clientHeight,
//     document.documentElement.clientHeight,
//   );
// }

export function useHeight() {
  const [docsHeight, setDocsHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    let mounted = true;
    let timer: any = null;
    window.addEventListener('resize', () => {
      if (mounted) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          // console.log('리사이즈 이벤트 시작');
          setDocsHeight(window.innerHeight);
        }, 300);
      }
    });
    return () => {
      // console.log('리사이즈 이벤트 종료');
      mounted = false;
    };
  });
  return {
    docsHeight,
  };
}
