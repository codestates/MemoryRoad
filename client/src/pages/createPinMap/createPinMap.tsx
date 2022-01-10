import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { savePinInfo } from '../../redux/actions/index';
import type { RootState } from './../../redux/reducer/index';
import './createPinMap.css';
import createPinModal from '../../modals/createPinModal/createPinModal'; // 핀 생성 모달창
import SearchPinBar from '../../components/searchPinBar/searchPinBar'; // 핀 검색창
import { InfoWindowContent } from '../../modals/pinContent/pinContent'; // infoWindow 창 생성하는 함수
import FakeHeader from '../../components/map-test/fakeHeader'; // 가짜 헤더입니다 착각 조심 ^ㅁ^

const { kakao }: any = window;

/* [ 마커 여러개 가져올 때 지도 범위 재설정하는 메서드, setBounds() ]
 * [위도, 경도]세트들이 들어있는 배열을 받아 보관함 카드 모달창에서 지도 보여줄때 써먹기
 */

// 지도 핀 직접 찍는 메서드랑 검색 메서드 나누기 가능 ...? 루트 연결 가능 ??? 하 ..

function CreatePinMap() {
  const dispatch = useDispatch();
  /* redux 전역 상태관리 */ // 왜 type 할당 : RootState는 되고 RootPersistState는 안되나요 ?
  // persist-redux createRouteReducer 상태 데려옴
  const routeState: any = useSelector(
    (state: RootState) => state.createRouteReducer,
  );
  // pin 저장 배열만 빼옴
  const pinPositions = routeState.pinPosition;
  console.log(pinPositions);

  // *상태 관리
  const [currLevel, setCurrLevel] = useState(8); // 지도의 레벨
  const [blueMarkerLocation, setBlueMarkerLocation] = useState([
    37.566826, 126.9786567,
  ]); // 지도에 표시된 마커의 위도, 경도
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달창 오픈 여부
  const [searchText, setSearchText] = useState(''); // 검색창 단어
  const [pinTitle, setPinTitle] = useState(''); // 핀의 제목
  const [pinImages, setPinImages] = useState<any[]>([]); // 핀의 사진 (file객체에서 바로 빼내온 사진들 배열)  -> useState<any[]>([]) 그냥 할당하는것과 어떤차이가 있는지 ??
  const [pinImageNames, setPinImageNames] = useState<any[]>([]); // 핀의 사진의 이름들
  const [mutations, setMutations] = useState(0); // DOM의 변경사항 감지

  /* 나 테스트 할거다. --------------------------------------------------------------------------------------------------------------------------------- */
  /* 파란 마커와 회색 마커 지도 위에 한 가지 종류만 띄우기 */
  const [blueMarker, setBlueMarker] = useState(false);
  const [grayMarker, setGrayMarker] = useState(true);
  const handleBlueMarker = (boolean: boolean): void => {
    setBlueMarker(boolean);
  };
  const handleGrayMarker = (boolean: boolean): void => {
    setGrayMarker(boolean);
  };
  /* 브라우저 위에 뜨는 핀 저장 모달창은 어짜피 하나다. 즉, 선택된 현재 위치도 언제나 한 개다. */
  /* 클릭된 핀의 모든 주소 정보를 담고 있는 객체다 :) */
  const [currMarkerInfo, setCurrMarkerInfo] = useState({
    latitude: 37.566826,
    longitude: 126.9786567,
    lotAddress: null,
    roadAddress: null,
    ward: null,
  });
  /* 저장버튼 클릭 상태 */
  const [saveBtnClick, setSaveBtnClick] = useState(false);
  /* 저장 버튼이 클릭되었다면 reducer로 action을 보내줍니다 */
  if (saveBtnClick) {
    const len = pinPositions.length;
    const pinID = len === 0 ? 'pin1' : `pin${len + 1}`;
    const ranking = len === 0 ? 1 : len + 1;
    dispatch(savePinInfo(pinID, ranking, pinTitle, currMarkerInfo));
    setSaveBtnClick(false);
  }
  /* 나 테스트 할거다. -----------------------------------------------------------------------------------------------------------------------------------*/

  // 핀 생성 모달창 open/close 핸들러 함수 (검색창으로 내려주고있어요. **)
  const handleIsModalOpen = (boolean: boolean): void => {
    // 모달창 HTMLElement가 남아있다면 제거하는 로직
    const modalTag = document.getElementById('createPinModal-background');
    if (modalTag) {
      modalTag.remove();
    }
    setIsModalOpen(boolean);
  };
  // 검색창 검색어 핸들러 함수
  const getSearchText = (text: string): void => {
    setSearchText(text);
  };

  /* addEventListener의 유명 함수들 ---------------------------------------------- */

  // 핀의 제목 input 핸들러 함수
  const handlePinTitle = (event: any): void => {
    const text = event.target.value;
    setPinTitle(text); // -----------------------------------------------------------------------------------------------------------> 핀 제목
    // 인포윈도우 창 아무곳이나 눌러야 출력되는 기이한 현상..일단 저장버튼 눌렀을 때 타이틀값이 들어온다는 것에 만족해야하나 -> 이벤트핸들러 input이 해결해줌.
  };
  // 핀의 사진 업로드 버튼 핸들러 함수
  const handlePinImgFiles = (event: any) => {
    // 사진의 파일 리스트
    const fileList = event.target.files;
    const imgArr: any = [];
    for (let i = 0; i < fileList.length; i++) {
      imgArr.push(fileList[i]);
    }
    setPinImages(imgArr); // ---------------------------------------------------------------------------------------------------------> 핀 사진 배열
    /* js migrate */
    const container: any = document.getElementById(
      'createPinModal-pictures-container',
    );
    // DOM 감시자 테스트 통과!
    const observer = new MutationObserver((mutations: any) => {
      // console.log(pinImages); // 와 ... 여기서도 감지가 안됩니다.
      // console.log(`변경 사항 감지: ${mutations[0].target.children.length}`);
      // DOM의 node가 변경되었을 때의 작업
      const childArr = mutations[0].target.children;
      const imageNamesArr: any = [];
      for (const el of childArr) {
        imageNamesArr.push(el.id);
      }
      setPinImageNames(imageNamesArr);
      setMutations(mutations[0].target.children.length);
      // 해당 태그의 속성/자식요소의 변화가 감지되면
      // 해당 태그의 자식 요소의 개수를 상태에 반영해 useEffect가 정상동작하도록 했습니다.
    });
    const option = {
      childList: true,
      attributes: true,
      characterData: true,
    };
    observer.observe(container, option);
    // for문을 돌면서 사진들을 DOM에 나열
    for (let i = 0; i < fileList.length; i++) {
      const box = document.createElement('div');
      box.setAttribute('class', 'createPinModal-picture-box');
      box.setAttribute('id', ''.concat(fileList[i].name));
      container.appendChild(box);
      const btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      btn.setAttribute('class', 'createPinModal-delete-picture');
      btn.addEventListener('click', deletePinImgFile);
      const closeBtn = document.createElement('img');
      closeBtn.setAttribute('class', 'createPinModal-close-btn');
      closeBtn.setAttribute(
        'src',
        'http://127.0.0.1:5500/client/public/img/close_icon.png',
      );
      closeBtn.setAttribute('name', ''.concat(fileList[i].name));
      btn.appendChild(closeBtn);
      box.appendChild(btn);
      const newImg = document.createElement('img');
      newImg.setAttribute('class', 'createPinModal-picture');
      newImg.setAttribute('src', URL.createObjectURL(fileList[i]));
      box.appendChild(newImg);
    }
  };
  // 핀 저장 버튼 핸들러 함수
  // 저장을 눌렀을 때 해결해야하는 일들이 많다 ..
  // 핀에 순서/제목/사진종류 담아서 sessionStorage로 전역에서 관리를 하게 하고 -> redux & sessionStorage ?
  // 핀의 순서가 변경되었을 때 (사이드바) 전역 상태 변경 해야하고 oo -> redux & sessionStorage ?
  // 핀 자체의 시간이 늘어나고 줄어들었을 때 (사이드바) 도 상태를 변경해야한다.
  // 핀 삭제 / 수정 버튼 (사이드바) 요청에 따라 또 전역 상태 변경해줘야하는데 .. -> 모두 리덕스에서 sessionStorage를 처리하도록 해야겄다..!
  const handleSavePin = () => {
    console.log('저장 버튼을 눌렀습니다.');
    setSaveBtnClick(true);

    // /*---------- formData axios 요청 보낼 것. -> 핀 하나만 수정할 때 쓸 수 있는 폼 데이터 형식 ------------*/
    // // window의 formData 생성
    // const formData = new FormData();
    // const data = [
    //   {
    //     pinTitle: pinTitle,
    //   },
    // ];
    // pinImages.forEach((img, idx: number) => {
    //   formData.append('imgFiles', pinImages[idx]);
    // });
    // formData.append(
    //   'data',
    //   new Blob([JSON.stringify(data)], { type: 'application/json' }),
    // );
    // /*---------- formData axios 요청 보낼 것. -> 핀 하나만 수정할 때 쓸 수 있는 폼 데이터 형식 ------------*/

    // 잠깐만 ... 이것도 일단 잔역 상태(store)에 이미지 배열만 좌르륵 저장해놓고 -> 루트 저장버튼을 누르면 (사이드바) 그제서야 form을 생성하여 데이터를 보내줘야할까.
    // 이제 핀을 생성한 후에 이미지들이 들어있는 배열을 0으로 만들때 쓰는 상태업데이트.
  };
  // 핀 닫기 버튼 핸들러 함수
  const handleClosePin = () => {
    console.log('닫기 버튼을 눌렀습니다.');
    const deleteTag: any = document.getElementById('createPinModal-background');
    deleteTag.remove();
    handleIsModalOpen(false);
  };
  // 핀의 사진 개별 삭제 버튼 핸들러 함수 (브라우저위에서만 제거합니다. 실제 상태를 업데이트하지는 않습니다.)
  function deletePinImgFile(event: any) {
    console.log('사진을 삭제하셨습니다.');
    const fileName = event.target.name;
    const deleteTag: any = document.getElementById(fileName);
    deleteTag.remove();
  }

  /* ------------------------------------------------------------------------- */

  /* 지도 위 동작 - 이미지or함수 ----------------------------------------------------------------------------- */

  const [lat, lng] = blueMarkerLocation;

  // center (가공된)위도 경도 얻는 함수
  const sliceLatLng = (num: number): number => {
    const str = String(num);
    const [head, tail] = str.split('.');
    let slicedTail;
    if (head.length === 2) {
      slicedTail = tail.substring(0, 6);
    } else {
      slicedTail = tail.substring(0, 7);
    }
    const combineHeadTail = head + '.' + slicedTail;
    return Number(combineHeadTail);
  };

  // 주소-좌표 변환 객체 생성 : services 라이브러리 추가해야함 ^-^ API 문서 똑띠 읽어라
  const geocoder: any = new kakao.maps.services.Geocoder();

  // 지도 주소 얻어오는 함수
  function searchDetailAddrFromCoords(coords: any, callback: any): any {
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
  }

  // *마커 이미지 생성
  const imageSrc = 'http://127.0.0.1:5500/client/public/img/blue_marker.png';
  const imageSize = new kakao.maps.Size(33, 54);
  const imageOption = { offset: new kakao.maps.Point(16, 55) };
  const markerImage = new kakao.maps.MarkerImage(
    imageSrc,
    imageSize,
    imageOption,
  );
  // *마커
  const marker = new kakao.maps.Marker({
    image: markerImage,
    position: new kakao.maps.LatLng(lat, lng), // 현재 위치 상태 업데이트 반영
    clickable: true, // 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정
  });
  // *마커 이미지 생성 - 검색용 마커
  const imageSrcForSearch =
    'http://127.0.0.1:5500/client/public/img/gray_marker.png';
  const imageSizeForSearch = new kakao.maps.Size(33, 54);
  const imageOptionForSearch = { offset: new kakao.maps.Point(16, 55) };
  const markerImageForSearch = new kakao.maps.MarkerImage(
    imageSrcForSearch,
    imageSizeForSearch,
    imageOptionForSearch,
  );
  // *마커 이미지 생성 - 루트용 마커
  const imageSrcForRoute =
    'http://127.0.0.1:5500/client/public/img/red_pin.png';
  const imageSizeForRoute = new kakao.maps.Size(33, 54);
  const imageOptionForRoute = { offset: new kakao.maps.Point(16, 55) };
  const markerImageForRoute = new kakao.maps.MarkerImage(
    imageSrcForRoute,
    imageSizeForRoute,
    imageOptionForRoute,
  );
  // 장소명 인포윈도우
  const infoWindow = new kakao.maps.InfoWindow({ zIndex: 0.9 });
  // 핀 생성 모달창 인포윈도우
  const infoWindowModal = new kakao.maps.InfoWindow({ zIndex: 1 });

  // *infoWindow 기본 css 없애는 함수
  function removeInfoWindowStyle(htmlTag: any): void {
    htmlTag.parentElement.parentElement.style.border = '0px';
    htmlTag.parentElement.parentElement.style.background = 'unset';
    htmlTag.parentElement.previousSibling.style.display = 'none';
  }
  // 핀 생성 모달창 이후에 위치를 변경할 수도 있겠다는 생각에 분리해놓은 함수
  function removeInfoWindowMoalStyleAndAddStyle(htmlTag: any): void {
    htmlTag.parentElement.parentElement.style.border = '0px';
    htmlTag.parentElement.parentElement.style.background = 'unset';
    htmlTag.parentElement.previousSibling.style.display = 'none';
  }
  // *핀 생성 모달창의 모든 요소에 이벤트 핸들러를 등록하는 함수
  function addEventHandler() {
    // 핀의 제목 input 태그 이벤트 등록
    const pinTitleTag: any = document.getElementById(
      'createPinModal-place-title', // 왜 null | HTMLInputElement 는 안되나
    );
    pinTitleTag?.addEventListener('change', handlePinTitle); // 와 .. input 내부의 값을 감지하는 건 input 이라는 이벤트핸들러군요 ..
    // 핀의 사진 업로드 버튼 태그 이벤트 등록
    const uploadTag = document.getElementById('file-upload');
    uploadTag?.addEventListener('change', handlePinImgFiles);
    // 핀 저장 버튼 태그 이벤트 등록
    const saveBtnTag: any = document.getElementById('createPinModal-save-btn');
    saveBtnTag?.addEventListener('click', handleSavePin);
    // 핀 닫기 버튼 태그 이벤트 등록
    const closeBtnTag = document.getElementById('createPinModal-not-save-btn');
    closeBtnTag?.addEventListener('click', handleClosePin);
  }

  /* 지도 위 동작 useEffect ----------------------------------------------------------------------------- */

  useEffect(() => {
    const newPinImages = pinImages.filter((el) =>
      pinImageNames.indexOf(el.name) === -1 ? false : true,
    );
    setPinImages(newPinImages);
  }, [mutations]);

  useEffect(() => {
    // 지도를 표시할 div
    const mapContainer = document.getElementById('map');
    // 파란 마커냐 회색 마커냐에 따라 중심 좌표 바꿔주기.
    // const currLat = blueMarker ? lat : latS;
    // const currLng = blueMarker ? lng : lngS;
    // 지도의 option들
    const mapOptions = {
      center: new kakao.maps.LatLng(lat, lng), // -> 지도의 중심을 마커에 마추고싶다면 파란마커 회색마커 나눠서 진행할것.
      level: currLevel, // 지도의 확대 레벨 (분포도가 잘 보이는 레벨: 8) (지역이 잘 보이는 레벨: 3)
      draggable: true, // 마우스 드래그, 휠, 모바일 터치를 이용한 확대 및 축소 가능 여부
      scrollwheel: true, // 마우스 휠, 모바일 터치를 이용한 확대 및 축소 가능 여부
      disableDoubleClickZoom: true, // 마우스 더블 클릭으로 지도 확대 및 축소 불가능 여부
    };
    // 지도를 생성합니다
    const map = new kakao.maps.Map(mapContainer, mapOptions);
    // map.setMaxLevel(8); // 지도의 최고 레벨값. -> 서울 지역을 벗어나면 검색이 안되게끔 해야 이걸 적용할 수 있음 .. 지금은 검색 기능 & bound 기능때문에 제한 걸지 못함.

    // 지도 이벤트 모음
    // *지도에 변화가 일어났을 때 실행되는 이벤트 핸들러 -> 시시각각 변하는 지도의 센터를 추적할 수 있음.
    kakao.maps.event.addListener(map, 'idle', function () {
      const level = map.getLevel();
      setCurrLevel(level); // 지도 레벨 상태 저장
    });

    // 내가 생성한 마커 이벤트 모음
    // *마커 생성
    // marker.setMap(map); // --------------------------------------------------------------------------------------------------------------------------------> test
    if (blueMarker) marker.setMap(map);
    kakao.maps.event.addListener(marker, 'click', function () {
      // -> infoWindow를 개조해서 가는 걸로 결정.
      handleIsModalOpen(true); // 모달창 오픈 여부 상태 저장
      infoWindowModal.setContent(createPinModal);
      infoWindowModal.open(map, marker);
      // infoWindow 기본 css 없애기
      const infoWindowModalHTMLTag = document.querySelector(
        '#createPinModal-background',
      );
      removeInfoWindowMoalStyleAndAddStyle(infoWindowModalHTMLTag);
      addEventHandler();
    });
    // *마커 지도에 얹기
    kakao.maps.event.addListener(map, 'click', function (mouseEvent: any) {
      searchDetailAddrFromCoords(
        mouseEvent.latLng,
        function (result: any, status: any): void {
          if (status === kakao.maps.services.Status.OK) {
            const latlng = mouseEvent.latLng; // 클릭한 위도, 경도 정보를 가져옴
            const level = map.getLevel();
            marker.setMap(null);
            infoWindowModal.close();
            marker.setPosition(latlng); // 마커 위치를 클릭한 위치로 옮김 - setPosition

            const latlngMarker: Array<number> = [
              sliceLatLng(latlng.Ma),
              sliceLatLng(latlng.La),
            ];
            setBlueMarkerLocation(latlngMarker); // [latlng.Ma, latlng.La] 위도와 경도 배열로 뽑아낼 수 있음. -> 현재 테스트중입니다.
            setCurrLevel(level);
            // setPinTitle(null);

            const place = result[0].address;
            const blueMinfo: any = {
              latitude: sliceLatLng(latlng.Ma), // 위도
              longitude: sliceLatLng(latlng.La), // 경도
              lotAddress: place.address_name, // 지번 주소
              roadAddress: !!place.road_address
                ? place.road_address.address_name
                : '', // 도로명 주소
              ward: place.region_2depth_name, // 지역 '구'
            };
            setCurrMarkerInfo(blueMinfo);
          }
        },
      );
    });
    // 장소 검색 이벤트 모음
    const ps = new kakao.maps.services.Places();
    if (grayMarker) ps.keywordSearch(searchText, placesSearchCB);

    function placesSearchCB(data: any, status: any, pagination: any) {
      if (status === kakao.maps.services.Status.OK) {
        // const bounds = new kakao.maps.LatLngBounds();
        if (isModalOpen) infoWindowModal.close();

        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i]);
          // bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정 과연 필수인가
        // map.setBounds(bounds);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
        return;
      } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
        return;
      }
    }
    function displayMarker(place: any) {
      // *마커 - 검색용
      const markerForSearch = new kakao.maps.Marker({
        image: markerImageForSearch,
        map: map,
        position: new kakao.maps.LatLng(
          sliceLatLng(place.y),
          sliceLatLng(place.x),
        ),
        clickable: true, // 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정
      });
      // 검색용 마커 클릭했을 때 발생되는 이벤트
      kakao.maps.event.addListener(markerForSearch, 'click', function () {
        infoWindowModal.setContent(createPinModal);
        infoWindowModal.open(map, markerForSearch);
        // infoWindow 기본 css 없애기
        const infoWindowModalHTMLTag = document.querySelector(
          '#createPinModal-background',
        );
        removeInfoWindowMoalStyleAndAddStyle(infoWindowModalHTMLTag);
        // 검색용 마커도 현재위치를 전환할 수 있는 기회를 주었다. 오류가 났다.
        // 그래서 다른 상태로 업데이트하기로 했다.
        addEventHandler();

        const grayMinfo: any = {
          latitude: sliceLatLng(place.y),
          longitude: sliceLatLng(place.x),
          lotAddress: place.address_name,
          roadAddress: !!place.road_address_name ? place.road_address_name : '',
          ward: place.address_name.split(' ')[1],
        };
        setCurrMarkerInfo(grayMinfo);
      });
      // 검색용 마커 위에 마우스를 올렸을 때 발생되는 이벤트
      kakao.maps.event.addListener(markerForSearch, 'mouseover', function () {
        const content = InfoWindowContent(
          place.place_name,
          place.address_name,
          place.road_address_name,
        );
        infoWindow.setContent(content);
        infoWindow.open(map, markerForSearch);
        // infoWindow 기본 css 없애기
        const infoWindowHTMLTags = document.querySelectorAll(
          '.windowInfo-content-container',
        );
        removeInfoWindowStyle(infoWindowHTMLTags[0]);
      });
      // 검색용 마커 위에서 마우스를 뗐을 때 발생되는 이벤트
      kakao.maps.event.addListener(markerForSearch, 'mouseout', function () {
        infoWindow.close();
      });
    }
  }, [blueMarkerLocation, searchText, blueMarker, grayMarker, saveBtnClick]); // -------------------------------------------------------------------------------------------> test
  return (
    <>
      <div id="map-whole-container">
        <div id="map-navigator-top">
          <FakeHeader />
          <SearchPinBar
            getSearchText={getSearchText}
            handleBlueMarker={handleBlueMarker}
            handleGrayMarker={handleGrayMarker}
            handleIsModalOpen={handleIsModalOpen}
          />
        </div>
        <div id="map"></div>
      </div>
    </>
  );
}

export default CreatePinMap;
