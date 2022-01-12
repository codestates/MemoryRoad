import React, { useState, useEffect } from 'react';
import interact from 'interactjs';
import './mm.css';

// 이건 또 왜 렌더링 안되냐
function Comp({ name }: any) {
  return (
    <div className="draggable" id={name}>
      {name}
    </div>
  );
}

function Mm() {
  const [pos, setPos] = useState(['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7']); // 순서는 얘네만 변해.
  const [height, setHeight] = useState([50, 50, 50, 50, 50, 50, 50]); // 높이 모음
  /* 난 전체 높이를 추적할거야 */
  const [basic, setBasic] = useState([0, 0, 0, 0, 0, 0, 0]);
  /* 전체 y 시작점 = startPoint */
  const [startPoint, setStartPoint] = useState([
    0, 50, 100, 150, 200, 250, 300,
  ]);
  /* 전체 y 끝점 = endPoint */
  const [endPoint, setEndPoint] = useState([50, 100, 150, 200, 250, 300, 350]);

  /* 내가 찾은 외부 함수 ----------------------------------------------------------------------------*/
  // overlaping 막기
  const [overlap, setOverlap] = useState(false);
  function noOverlap(event: any, overlapElements: any) {
    const dy = event.dy;

    //just for flagging when the target would overlap another element
    const targetDims = event.target.getBoundingClientRect();
    // const test = [];
    // for (let i = 0; i < overlapElements.length; i++) {
    //   test.push(overlapElements[i].getBoundingClientRect());
    // }
    // test.sort((a, b): any => {
    //   // sort 아쉽게도 인덱스값에는 접근 못함
    //   if (a.y - b.y === 0) {
    //     console.log('same');
    //     return 0;
    //   } else if (a.y - b.y > 0) {
    //     console.log('b < a : 기존 배열 유지함');
    //     return 1;
    //   } else if (a.y - b.y < 0) {
    //     console.log('a < b : 뭔가 바뀌었음');
    //     return -1;
    //   }
    // });
    // console.log(test);
    // console.log(startPoint);
    // const newArr = test.map((el) => {
    //   const num: number = Math.floor(el.y);
    //   return `p${startPoint.indexOf(num) + 1}`;
    // });
    // position을 업데이트한다는 건 내 오만이었나.

    for (let i = 0; i < overlapElements.length; i++) {
      const overlapElementDims = overlapElements[i].getBoundingClientRect();

      //make sure the element doesn't look at itself..
      if (overlapElements[i] != event.target) {
        //checks if the target "doesn't" overlap
        if (
          targetDims.top + 1 + dy > overlapElementDims.bottom ||
          targetDims.bottom + dy < overlapElementDims.top + 1
        ) {
          //Basically, the target element doesn't overlap the current
          //element in the HTMLCollection, do nothing and go to the
          //next iterate
        } else {
          //This is if the target element would overlap the current element

          //set overlap to true and break out of the for loop to conserve time.

          setOverlap(true);
          break;
        }
      }
    }

    if (overlap === false) {
      //if there's no overlap, do your normal stuff, like:
      dragMoveListener(event);
      //then reset dx and dy
      // dy = 0;
      // dx = 0;
    } else {
      //check if the target "is" in the restriction zone
      const restriction: any = document.getElementById('test-ex');
      const restrictionDims = restriction.getBoundingClientRect();

      if (
        targetDims.right > restrictionDims.right ||
        targetDims.left < restrictionDims.left ||
        targetDims.bottom > restrictionDims.bottom ||
        targetDims.top < restrictionDims.top
      ) {
        event.target.style.webkitTransform = event.target.style.transform =
          'translate(0px, 0px)';

        //then reset dx and dy
        // dy = 0;
        // dx = 0;

        //then reset x and y
        // event.target.x = 0;
        const idx = pos.indexOf(event.target.id);
        basic[idx] = 0;
      }
    }
  }
  // 좌표 업데이트
  function dragMoveListener(event: any) {
    const target = event.target;
    const x = 0; // x의 변화도 감지할 수 있으나 지금은 필요없다.
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
      target.style.transform = `translate(${x}px, ${y}px)`;
    // update the position attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    // 전체 시작점(절대값) 업데이트 ok
    const newStart: any = startPoint.map((el: any, idx: any) => {
      if (pos.indexOf(target.id) === idx) {
        el += event.dy;
      }
      return el;
    });
    setStartPoint(newStart);
  }

  /* 내가 찾은 외부 함수 --------------------------------------------------------------------------*/

  /* 모든 박스의 크기는 변할 수 있음.*/
  /* 박스의 크기가 변했을 때 (늘이거나 줄이거나 모두 해당): */
  // 해당 박스가 위치한 인덱스값을 파악한 후, 그 인덱스 값보다 "뒤"에 있는 친구들의 startPoint를 박스 크기 변한만큼 (+ or -) 업데이트 시켜준다.
  // 그리고 크기 변할 때 박스들이 위치 이동 좀 하는데 이거 막기 -> 어떻게 안되늬
  // 참고 함수는 찾음 ...

  /* 모든 박스의 위치는 변할 수 있음.*/
  /* 박스의 순서가 바뀌었을 때 */

  /*--------------------------- */
  const container: any = document.getElementById('#test-ex');
  interact('.draggable')
    .draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: container,
          endOnly: true,
        }),
      ],
      listeners: {
        start(event) {
          console.log('start');
          console.log(event.target.id);
        },
        move(event) {
          console.log('move');
          // 일단 drop 자체는 해야되니까 모두 실행은 시켜놨음.
          // dragMoveListener(event);
          /* 짝꿍 */
          const AllDraggableBox = document.querySelectorAll('.draggable');
          setOverlap(false);
          noOverlap(event, AllDraggableBox);
          /* 짝꿍 */
        },
        end(event) {
          console.log('end');
          /* move할 때 동작시킬건가 end할 때 동작시킬건가 */
          /* 짝꿍 */
          const AllDraggableBox = document.querySelectorAll('.draggable');
          setOverlap(false);
          noOverlap(event, AllDraggableBox);
          /* 짝꿍 */
        },
      },
    })
    .resizable({
      edges: {
        top: false,
        left: false,
        bottom: true,
        right: false,
      },
      listeners: {
        start: function (event) {
          console.log('resize-start');
        },
        move: function (event) {
          console.log('resize');
          // ?-? 없어도되네 ?-? -> 끄면 y 위치 움직이지않고 resizing 가능.
          /* 짝꿍 */
          // const AllDraggableBox = document.querySelectorAll('.draggable');
          // setOverlap(false);
          // noOverlap(event, AllDraggableBox);
          /* 짝꿍 */
          const target = event.target;
          const y = parseFloat(target.getAttribute('data-y')) || 0;
          Object.assign(event.target.style, {
            height: `${event.rect.height}px`, // event.rect.height
            transform: `translate(0px, ${y}px)`,
          });
          target.setAttribute('data-y', y);
        },
        end: function (event) {
          console.log('resize-end');
          // 전체 높이(절대값) 업데이트 ok
          const h = event.target.style.height;
          const newHeight = height.map((el: any, idx: any, arr: any) => {
            if (pos.indexOf(event.target.id) === idx) {
              return parseInt(h.split('px')[0]);
            }
            return el;
          });
          setHeight(newHeight);
          // resize 이벤트 일어나면 전체 startPoint 업데이트
          // const targetIdx = pos.indexOf(event.target.id);
          // const newOne = new Array(pos.length).fill(0);
          // pos.forEach((el, idx) => {
          //   // 현재 선택된 pin 보다 인덱스 작을때 (앞쪽에 있을 때)
          //   if (idx <= targetIdx) {
          //     const num = Number(el.split('p')[1]) - 1;
          //     newOne[num] = startPoint[num];
          //   }
          //   // 현재 선택된 pin이랑 인덱스가 같을 때 (자기자신 업데이트)
          //   // 현재 선택된 pin보다 인덱스 클 때 (뒤쪽에 있을때)
          //   else {
          //     const num = Number(el.split('p')[1]) - 1;
          //     newOne[num] = startPoint[num] + parseInt(h.split('px')[0]);
          //   }
          // });
          // setStartPoint(newOne);
        },
      },
      autoScroll: {
        container: container,
        margin: 50,
        distance: 5,
        interval: 10,
        speed: 400,
      },
    });

  return (
    <>
      <div id="test-ex">
        <div>
          {pos.map((el, idx) => (
            <Comp key={idx} name={el} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Mm;
