import React, { useState } from 'react';
import interact from 'interactjs';
import CardSample from './card-sample';
import './grid-test.css';

function TimeBack() {
  // overlaping 아예 막는 함수.
  function noOverlap(event: any, overlapElements: any) {
    const dy = event.dy;
    const targetDims = event.target.getBoundingClientRect();

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
          break;
        }
      }
    }
  }

  /* 외부 함수 */
  function dragMoveListener(event: any) {
    const target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform = target.style.transform =
      'translate( 0px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-y', y);
  }
  // 외부 js 모듈 테스트
  const [position, setPosition] = useState([
    { id: 'pin0', y: 0 },
    { id: 'pin1', y: 0 },
    { id: 'pin2', y: 0 },
    { id: 'pin3', y: 0 },
    { id: 'pin4', y: 0 },
    { id: 'pin5', y: 0 },
    { id: 'pin6', y: 0 },
    { id: 'pin7', y: 0 },
  ]);
  const contentContainer: any = document.getElementById(
    'pinControllTower-timeBack',
  );
  interact('.pinControllTower-pinCard')
    /* drag event */
    .draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.snap({
          targets: [interact.snappers.grid({ x: 28, y: 28 })], // 그나마 제일 잘 떨어지는 숫자
          range: Infinity,
          relativePoints: [{ x: 0, y: 0 }],
        }),
        interact.modifiers.restrict({
          restriction: contentContainer,
          elementRect: { top: 0, left: 0, bottom: 0, right: 0 },
          endOnly: true,
        }),
      ],
      listeners: {
        start(event) {
          console.log(event.type);
        },
        move(event) {
          console.log(event.type);
          dragMoveListener(event);
          // setPosition(newArr); move할때마다 div의 상태를 자꾸 업데이트 시켜주니까 뻑이 나는구나.
        },
        end(event) {
          console.log(event.type);
          // event.target에 해당하는 element top값 업데이트 시켜주기
          /* top값 구하기 -> 이걸 잘 구하면 될 것 같아 ...! 
          -> 문제는 top값이 화면 기준이라는거다. 맨 위에 있을 때만 모두 양수의 값을 갖는다 ..*/
          const arr = document.querySelectorAll('.pinControllTower-pinCard');
          const topArr = [];
          for (let i = 0; i < arr.length; i++) {
            const id = arr[i].id;
            const top = arr[i].getBoundingClientRect().top;
            /* id와 top값을 묶어 배열에 차곡차곡 */
            topArr.push([id, top]);
          }
          const originArr = topArr.slice();
          const arrangedArr = topArr.sort(
            (a, b): any => Number(a[1]) - Number(b[1]), // 분명 숫자가 들어가는데 왜 Number로 바꿔줘야하냐
          );
          console.log(originArr);
          console.log(arrangedArr);
        },
      },
      autoScroll: {
        container: contentContainer,
      },
    })
    /* resize event */
    .resizable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictEdges({
          outer: contentContainer,
        }),
        interact.modifiers.restrictSize({
          min: { width: 200, height: 30 },
        }),
      ],
      edges: {
        top: true,
        left: false,
        bottom: true,
        right: false,
      },
      listeners: {
        move: function (event) {
          console.log('resizing');
          const target = event.target;
          let y = parseFloat(target.getAttribute('data-y')) || 0;

          target.style.width = event.rect.width + 'px'; // 너비 업데이트
          target.style.height = event.rect.height + 'px'; // 높이 업데이트

          y += event.deltaRect.top;

          target.style.webkitTransform = target.style.transform =
            'translate( 0px,' + y + 'px)';

          target.setAttribute('data-y', y);

          /* resize할 때 박스끼리 넘는 거 막기 */
          const allElements = document.querySelectorAll(
            '.pinControllTower-pinCard',
          );
          // noOverlap(event, allElements); // 안들어먹음
        },
      },
      autoScroll: {
        container: contentContainer,
        margin: 50,
        distance: 5,
        interval: 10,
        speed: 400,
      },
    });

  return (
    <>
      <div id="pinControllTower-timeBack">
        {/* Here! ----------------------------------------------------------------------*/}
        {position.map((el: any, idx: any) =>
          idx !== 0 ? <CardSample key={idx} name={el.id} /> : null,
        )}
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">00:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="p-00-00"></div>
        <div className="pinControllTower-select-section" id="00-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">01:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="01-00"></div>
        <div className="pinControllTower-select-section" id="01-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">02:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="02-00"></div>
        <div className="pinControllTower-select-section" id="02-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">03:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="03-00"></div>
        <div className="pinControllTower-select-section" id="03-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">04:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="04-00"></div>
        <div className="pinControllTower-select-section" id="04-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">05:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="05-00"></div>
        <div className="pinControllTower-select-section" id="05-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">06:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="06-00"></div>
        <div className="pinControllTower-select-section" id="06-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">07:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="07-00"></div>
        <div className="pinControllTower-select-section" id="07-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">08:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="08-00"></div>
        <div className="pinControllTower-select-section" id="08-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">09:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="09-00"></div>
        <div className="pinControllTower-select-section" id="09-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">10:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="10-00"></div>
        <div className="pinControllTower-select-section" id="10-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">11:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="11-00"></div>
        <div className="pinControllTower-select-section" id="11-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">12:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="12-00"></div>
        <div className="pinControllTower-select-section" id="12-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">13:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="13-00"></div>
        <div className="pinControllTower-select-section" id="13-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">14:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="14-00"></div>
        <div className="pinControllTower-select-section" id="14-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">15:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="15-00"></div>
        <div className="pinControllTower-select-section" id="15-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">16:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="16-00"></div>
        <div className="pinControllTower-select-section" id="16-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">17:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="17-00"></div>
        <div className="pinControllTower-select-section" id="17-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">18:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="18-00"></div>
        <div className="pinControllTower-select-section" id="18-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">19:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="19-00"></div>
        <div className="pinControllTower-select-section" id="19-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">20:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="20-00"></div>
        <div className="pinControllTower-select-section" id="20-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">21:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="21-00"></div>
        <div className="pinControllTower-select-section" id="21-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">22:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="22-00"></div>
        <div className="pinControllTower-select-section" id="22-30"></div>
        <div className="pinControllTower-time-section">
          <div className="pinControllTower-time-txt">23:00</div>
          <hr className="pinControllTower-divide-line"></hr>
        </div>
        <div className="pinControllTower-select-section" id="23-00"></div>
        <div className="pinControllTower-select-section" id="23-30"></div>
      </div>
    </>
  );
}

export default TimeBack;
