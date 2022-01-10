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
