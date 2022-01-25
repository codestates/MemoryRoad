// KAKAO MAP API ERROR HANDLING

/* map API test -------------------------------------------------------------------------------------------------------- */

// // idle과 거의 동시에, 횟수도 비슷하게 일어나지만 화면이 깨지지 않으면 반영하지 못하는 단점이 있음. (원치 않게 동작할 수도)
// kakao.maps.event.addListener(map, 'tilesloaded', function () {
//   console.log('loading tile is complete! do something');
// });
// // 지도에서 휠을 이용해 줌을 댕기고 줄일때만 반응함 .
// kakao.maps.event.addListener(map, 'zoom_changed', function () {
//   console.log('zoom changed!');
// });
// // 지도를 잡고 흔드는 상태에서도 센터는 변화하니까 ... 진짜 말 그대로 모든 변화를 감지함... 하
// kakao.maps.event.addListener(map, 'center_changed', function () {
//   console.log('center changed!')
// });

/* map API test --------------------------------------------------------------------------------------------------------- */

// 카카오 지도는 useEffect를 사용해 DOM이 생성된 이후에 조작을 가하는 방식으로 작동합니다.
// 지도의 부하를 막기위해 추적하는 상태를 최소한으로 줄이는 작업이 필요했습니다.
// 지도에서 발생한는 이벤트를 알아보기 위해 API test를 모두 마쳤습니다.
// currLevel 요소는 지도가 버벅거리는 근본적인 원인은 아니었습니다.
// 지도의 크기를 늘이고 줄일 때마다 엄청난 버벅임이 생겼는데, 이는 지도의 움직임을 부드럽게 하고자 사용했던 pinTo 메서드였습니다.
// window의 resize 이벤트에 의한 크기변경은 map.relayout 함수가 자동으로 호출된다고 나와있습니다.
// 저는 useEffect 인자를 최소한으로 줄였고, 지도의 center 변환 추적을 껐습니다.
// + 'center_changed' 에서 'idle' 로 map event 인자를 변경하였습니다.

// const ratioHorizontal: Array<number> = [
//   0, 0.0005, 0.001, 0.002, 0.004, 0.008, 0.016, 0.032, 0.064,
// ];
// const ratioVertical: Array<number> = [
//   0, 0.000562, 0.001125, 0.00225, 0.0045, 0.009, 0.017, 0.035, 0.07,
// ];

/* 결국 삭제된 customOverlay ---------------------------------------------------------------------------------  */

// 핀 생성 모달창 html 문자열 코드
// const createPin: string = createPinModal;
// // *핀 생성 모달창 커스텀 오버레이
// const customCreatePinModal = new kakao.maps.CustomOverlay({
//   // 현재 위치 상태 (비울에 따라) 업데이트
//   // 왼쪽 수평 정렬 : lat + 0.00008, lng - ratioHorizontal[currLevel]
//   // 위쪽 수직 정렬 : lat + ratioVertical[currLevel], lng - 0.0003
//   position: new kakao.maps.LatLng(
//     lat + 0.00008,
//     lng - ratioHorizontal[currLevel],
//   ),
//   content: createPin,
//   clickable: true, // 핀 저장 모달창을 편집하고 있을 때지도의 클릭 이벤트가 발생하지 않도록 설정
//   xaNCHOR: 0.99,
//   YaNCHOR: 0.99,
// });

// customCreatePinModal.setMap(null);
// 다른 장소 클릭할 때마다 customOverlay를 해제시켜주지 않아서 엉뚱한 곳에 이미지를 업로드 하고있었다 ㅠㅜㅜ -> 브라우저 위에 올려진 커스텀 오버레이를 지워주는 메서드
// 지금은 필요없어졌습니다.

/* 결국 삭제된 customOverlay ----------------------------------------------------------------------------------  */

// kakao API CustomOverlay 메서드를 다루면서 지도의 레벨과 상관없이 핀 옆에 모달창을 띄우고 싶어서 지도의 레벨과 위도, 경도 간의 비율을 연구했습니다.
// marker의 위쪽에 띄우고 싶다면 위도를 변경시켜야하고,
// marker의 옆쪽에 띄우고 싶다면 경도를 변경시켜야 하지만, 대체적으로 제곱의 배수의 형태를 띄고 있었습니다.

// customOverlay는 지도 바로 위에 띄워지는 DOM으로서 모달창의 위치를 지도가 변화할 때마다 잡아줘야한다는 단점이 있었습니다.
// customOverlay를 제가 미숙하게 다뤄서 그런거일수도 있습니다 !.!
// 결국 저는 지도의 레벨과 상관없이 마커와 함께 움직이는 infoWindow를 선택했고, 해당 infoWindow의 css를 수정하는 방향으로 버그를 잡았습니다.

// PIN SAVE LOGIC

/* 핀 저장버튼 누르는 동시에 pinID 생성 */
// (pinPosition의 길이가 0일땐 pin1 부여하고, 0이 아닐 땐 pinPosition의 길이에 1을 더하여 pin을 생성해주자.)
// (ranking은 pinID의 맨 마지막 수를 따라가면 돼.)
// (locationName은 상태에 저장된 값을 그냥 가져오기. -> 파란마커와 회색마커 둘 다 반영되어있습니다. 어짜피 브라우저에 뜨는 input창은 하나입니다.)
// (latitude, longitude, lotAddress, roadAddress, ward -> 파란마커와 회색마커 모두 상태 반영되어있습니다. 어짜피 브라우저에 뜨는 input창은 하나입니다.)
/* 핀 삭제버튼 누르는 동시에 pinID 검사 -> 사이드바에 있는 핀 카드에 있는 삭제버튼을 클릭했을 때 벌어지는 일 */
// 해당 핀을 삭제할거냐는 모달창이 뜨는 게 국룰이긴한데 일단은 보류
// (action의 인자: pinID -> reducer에서 pin배열에서 pinID가 일치하는 객체를 찾아 지워준다. files배열에서 pinID가 일치하는 객체를 찾아 사진도 삭제해준다.)
/* 핀 수정버튼 누르는 동시에 pinID 검사 -> 사이드바에 있는 핀 카드에 있는 수정버튼을 클릭했을 때 벌어지는 일*/
// 닫힌 핀을 열어줘야한다. -> 일단 createPinModal을 modifyPinModal.tsx 를 하나 더 생성해라
// (modifyPinModal은 createPinModal과 반대로 역으로 데이터를 넣어주는 작업이 필요하다.)
// (useSelector로 불러온 route state에서 현재 클릭한 핀 카드의 pinID 와 일치하는 객체를 찾아 HTML에 예쁘게 넣어주는 작업이 필요하다 :) 헤헤)
// (pins에서 가져올 수 있는 작업들이 있고 files에서 가져올 수 있는 작업들이 또 있다. -> 핀 카드가 가지고 있는 pinID와 일치하는 pin 정보와 files 정보를 받아와 렌더링 예쁘게 해서 띄워주자)
// (여기서 이제 핀 저장버튼 대신 수정완료 버튼이 들어간다. 창 닫기 버튼은 삭제삭제 ok)
//* - 핀 locationName, 핀 files 수정 reducer (핀 장소제목, 사진변경) -> 수정모달창에서 수정 완료 버튼을 눌렀을 때 !
// (action의 인자: pinID와 locationName, 변경된 이미지파일 배열(핀 생성모달창에서 썼던 observer 재활용하세여)
// -> reducer에서 pins배열에서 pinID가 일치하는 객체를 찾아 locationName를 업데이트 시켜주고 files배열에서 pinID가 일치하는 객체를 찾아 변경된 이미지 파일로 아예 switch 해준다.)
//* - 핀 startTime, endTime 수정 reducer (핀 시간변경)
// (action의 인자: pinID와 startTime, endTime -> reducer에서 pins배열에서 pinID가 일치하는 객체를 찾아 startTime과 endTime을 업데이트 시켜준다)
// - 핀 ranking 수정 reducer (핀 순서변경)
// (HTML내의 div태그의 변경을 감지하여:observer => pinID가 들어있는 pinPosition 배열을 업데이트시켜줘야합니다)
// 예시 : ['zero', 'pin1', 'pin2', 'pin3', 'pin4'] => ['zero', 'pin4', 'pin2', 'pin1', 'pin3'] -> 사용자 입장에서는 박스의 이동을 진짜 마음대로 할 수 있으니까 변경사항을 잘 감시하고 배열 전체를 인자로 받아야겠다.
//     :           랭킹1    랭킹2    랭킹3    랭킹4                랭킹1    랭킹2    랭킹3    랭킹4
// (action의 인자: 업데이트된 배열 -> reducer에서 pins배열에서 pinID가 일치하는 객체의 ranking을 인자로 들어온 배열의 인덱스값으로 업데이트시켜주면되겠다 !!)
/* 대망의 마지막: 루트 저장 버튼 누르는 동시에 */
// 서버에 요청보내고
// redux-persist에 있는 route와 pinPosition 키 값 지우기 ! 깨끗하게 청산 -.-

/* 생성된 핀을 저장하는 버튼이 있을거고, 이미 있던 핀을 수정하는 버튼이 있을거다. -> 수정버튼이 들어있는 모달창은 얼른 만들어줍시다. */
/*    저장 버튼이 눌리면 의심의 여지 없이 pinPosition의 길이를 확인하고 pinID를 부여하는 것이 맞지만, -> 저장 reducer */
/*    수정 버튼이 눌러면 pins 배열에서 주어진 pinID를 가진 객체를 일단 찾는 작업을 해야할겁니다.      -> 수정 reducer */

// 여기서 any를 부여해주니까 문제생기지 않는다 ... persist 때문에 여기에있는 상태로만은 부족한가봄.
