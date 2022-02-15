import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom';
// redux
import { Provider } from 'react-redux';
import store from '../../redux/store/index';
// components
import './modifyPinMap.css';
import createPinModal from '../../modals/createPinModal/createPinModal';
import modifyPinModal from '../../modals/modifyPinModal/modifyPinModal';
import SearchPinBar from '../../components/searchPinBar/searchPinBarForModify';
import ConfirmPinIsEmptyModal from '../../modals/confirmPinIsEmpty/confirmPinIsEmptyModal';
import ConfirmMoveToMypage from '../../modals/confirmRouteSave/confirmMoveToMypageForModify';
import { InfoWindowContent } from '../../modals/pinContent/pinContent';
import Navigation from '../../components/navigation/Navigation';
import TimeLineSideBar from '../../components/timeLineSideBar/timeLineSideBarForModify';
import SaveRouteModalForModify from '../../modals/saveRouteModal/saveRouteModalForModify';
import _ from 'lodash';
import '../../modals/createPinModal/createPinModal.css';
import ElementForCreate from '../../modals/modifyPinModal/elementForCreate';
import ElementForModify from '../../modals/modifyPinModal/elementForModify';
import axios from 'axios';

const { kakao }: any = window;

function ModifyPinMap() {
  const { id } = useParams(); // 루트의 id

  // 지도 전체 상태 --refact 22.02.15 refact
  const [kakaoMap, setKakaoMap] = useState<any>(null);
  const [currLevel, setCurrLevel] = useState(8);
  const [, setBlueMarkers] = useState<any>(null);
  const [, setGrayMarkers] = useState<any[]>([]);
  const [, setInfoModals] = useState<any[]>([]);
  const [, setRedPins] = useState<any[]>([]);
  const [, setPolylines] = useState<any[]>([]);

  // modal state
  const [isEmptyInfo, setIsEmptyInfo] = useState(false);
  const [isSidebarSaveBtnClicked, setIsSidebarSaveBtnClicked] = useState(false);
  const [isMoveToMypage, setIsMoveToMypage] = useState(false);
  const [isMouseOnCard, setIsMouseOnCard] = useState(false);
  const [currCardTitle, setCurrCardTitle] = useState(null);
  const [currModifiedID, setCurrModifiedID] = useState('');

  // search box state
  const [searchText, setSearchText] = useState('');

  // marker state
  const [route, setRoute] = useState(null);
  const [pins, setPins] = useState<any[]>([]);
  const [pinImage, setPinImage] = useState<any[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const [itemState, setItemState] = useState<any[]>([]);
  const [blueMarker, setBlueMarker] = useState(false);
  const [grayMarker, setGrayMarker] = useState(true);

  const handleSidebarSaveBtn = (bool: boolean) => {
    setIsSidebarSaveBtnClicked(bool);
  };
  const selectCurrModifedID = (idNum: string) => {
    setCurrModifiedID(idNum);
  };

  const handleBlueMarker = (boolean: boolean): void => {
    setBlueMarker(boolean);
  };
  const handleGrayMarker = (boolean: boolean): void => {
    setGrayMarker(boolean);
  };

  const onMouseEnter = (locationName: any) => {
    setCurrCardTitle(locationName);
    setIsMouseOnCard(true);
  };
  const onMouseLeave = () => {
    setIsMouseOnCard(false);
  };
  // const [newCounter, setNewCounter] = useState(0);

  /* -------------- react-grid-layout ---------------- */
  const onLayoutChange = (layout: any) => {
    setItemState(layout);

    const totalTime = layout.reduce((prev: any, curr: any) => {
      const currSH = curr.y * 0.5;
      const currEH = (curr.y + curr.h) * 0.5;
      const currTimes = currEH - currSH;
      return prev + currTimes;
    }, 0);
    setTotalTime(totalTime);

    const newTimePins: any = pins?.map((pin: any) => {
      layout.forEach((el: any, num: number) => {
        if (el.i === String(pin.id)) {
          const sh = parseInt(el.y) * 0.5;
          const eh = parseInt(el.y + el.h) * 0.5;
          const getHour = (hour: any) =>
            Math.floor((hour * 60) / 60).toString().length === 1
              ? '0' + Math.floor((hour * 60) / 60)
              : Math.floor((hour * 60) / 60);
          const getMinute = (hour: any) =>
            ((hour * 60) % 60).toString() === '0'
              ? '0' + ((hour * 60) % 60)
              : (hour * 60) % 60;
          pin.startTime = getHour(sh) + ':' + getMinute(sh);
          pin.endTime = getHour(eh) + ':' + getMinute(eh); // 핀 시간 업데이트
          pin.ranking = num; // 핀 랭킹 업데이트
        }
      });
      return pin;
    });
    setPins(newTimePins);
  };

  const createElement = (el: any) => {
    const i = el.add ? '+' : el.i;
    const { id, locationName, startTime, endTime } = pins?.filter(
      (pin: any) => String(pin.id) === el.i,
    )[0];
    const sh = Number(startTime?.split(':')[0]);
    const eh = Number(endTime?.split(':')[0]);
    const sm = Number(startTime?.split(':')[1]);
    const em = Number(endTime?.split(':')[1]);
    // const height = (eh - sh) * 2 + (em - sm < 0 ? -1 : 0);
    const getTime = (sh: number, eh: number, sm: number, em: number) => {
      if (em - sm < 0) return eh - sh - 1 + 0.5;
      else {
        if (em - sm !== 0) return eh - sh + 0.5;
        if (em - sm === 0) return eh - sh;
      }
    };
    const time = getTime(sh, eh, sm, em);
    return (
      <div
        className="pinCard-container"
        data-grid={el}
        key={i}
        onMouseEnter={() => onMouseEnter(i)}
        onMouseLeave={onMouseLeave}
      >
        <div className="pinCard-title">{locationName}</div>
        {isMouseOnCard && currCardTitle === i ? (
          <div className="pinCard-btn-container">
            <button
              className="pinCard-delete-btn"
              onClick={() => {
                // 삭제와 동시에 서버에 삭제 요청 보내기
                onRemoveItem(i);
                requestForDelete(Number(id));
              }}
            >
              삭제
            </button>
            <button
              className="pinCard-modify-btn"
              onClick={() => {
                selectCurrModifedID(i);
              }}
            >
              수정
            </button>
          </div>
        ) : (
          <div className="pinCard-time-container">
            <div className="pinCard-time-calculate">{time}</div>
            시간
          </div>
        )}
      </div>
    );
  };
  const onRemoveItem = (i: any) => {
    const updatedPins = pins.filter((el) => String(el.id) !== i);
    const newState: any = _.reject(itemState, { i: i });
    const updatedRank = updatedPins.map((pin: any) => {
      newState.forEach((item: any, idx: number) => {
        if (Number(item.i) === pin.id) pin.ranking = idx;
      });
      return pin; // 랭킹값 업데이트 ...?!!
    });
    setItemState(newState);
    setPins(updatedRank);
  };

  const onAddItem = (
    newCounter: number,
    pinTitle: any,
    pinImages: any,
    currMarkerInfo: any,
  ) => {
    let keywords: any = pinTitle.split(' ');
    if (currMarkerInfo.lotAddress.length) {
      const letters = currMarkerInfo.lotAddress
        .split(' ')
        .filter((word: string) => word.slice(-1) !== '구');
      keywords = keywords.concat(letters);
    }
    const newID = newCounter + 1; // 기존 방식 유지
    const newItem = {
      i: String(newID),
      x: 0,
      y: itemState.length * 2,
      w: 1,
      h: 2,
    };
    const newPin: any = {
      id: String(newID), // -- 내가 만든 상태 키 (클라이언트 업데이트용)
      ranking: newCounter,
      locationName: pinTitle,
      latitude: Number(currMarkerInfo.latitude),
      longitude: Number(currMarkerInfo.longitude),
      lotAddress: currMarkerInfo.lotAddress,
      roadAddress: currMarkerInfo.roadAddress,
      ward: currMarkerInfo.ward,
      startTime: '00:00',
      endTime: '01:00',
    };
    const newData: any = {
      ranking: newCounter,
      locationName: pinTitle,
      latitude: Number(currMarkerInfo.latitude),
      longitude: Number(currMarkerInfo.longitude),
      lotAddress: currMarkerInfo.lotAddress,
      roadAddress: currMarkerInfo.roadAddress,
      ward: currMarkerInfo.ward,
      startTime: '00:00',
      endTime: '01:00',
      keywords: keywords,
    };
    const newFile: any = {
      ranking: newCounter,
      files: pinImages,
    };
    // axios 생성 요청
    const formData = new FormData();
    formData.append('pin', JSON.stringify(newData));
    pinImages.forEach((el: any) => {
      formData.append('files', el);
    });

    axios({
      url: `https://server.memory-road.net/routes/${id}/pins`,
      method: 'post',
      data: formData,
      withCredentials: true,
    })
      .then((res) => {
        if (res.status === 201) {
          setPins((pins) => pins.concat(newPin));
          setItemState((items) => items.concat(newItem));
          if (pinImages.length !== 0) {
            setPinImage((pinImage) => pinImage.concat(newFile));
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onUpdateItem = (pinId: string, pinTitle: any, pinImages: any) => {
    const updatedPins = pins.map((el) => {
      if (String(el.id) === pinId) {
        el.locationName = pinTitle; // 타이틀 교체
        el.Pictures = pinImages; // 사진 교체
      }
      return el;
    });
    setPins(updatedPins);
  };

  // 핀 삭제
  const requestForDelete = (pinId: number | null) => {
    axios({
      url: `https://server.memory-road.net/routes/${id}/pins/${pinId}`,
      method: 'delete',
      withCredentials: true,
    })
      .then((res) => {
        if (res.status === 200) {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const map: any = [];

  // 핀 생성 모달창 open/close 핸들러 (검색창으로 내려주고있어요)
  const handleIsModalOpen = (): void => {
    // 모달창 HTMLElement가 남아있다면 제거하는 로직
    const modalTag = document.getElementById('createPinModal-background');
    if (modalTag) {
      modalTag.remove();
    }
  };
  // 핀 수정 모달창 open/close 핸들러
  const handleIsModifyModalOpen = (): void => {
    const modifyModalTag = document.getElementById('modifyPinModal-background');
    if (modifyModalTag) {
      modifyModalTag.remove();
    }
  };
  const getSearchText = (text: string): void => {
    // 검색창 검색어 핸들러 함수
    setSearchText(text);
  };

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

  // 주소-좌표 변환 객체 생성
  const geocoder: any = new kakao.maps.services.Geocoder();

  // 지도 주소 얻어오는 함수
  function searchDetailAddrFromCoords(coords: any, callback: any): any {
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
  }

  // 마커 이미지
  const markerImage = new kakao.maps.MarkerImage(
    'https://server.memory-road.net/upload/blue_marker.png',
    new kakao.maps.Size(33, 54),
    {
      offset: new kakao.maps.Point(16, 55),
    },
  );
  const markerImageForSearch = new kakao.maps.MarkerImage(
    'https://server.memory-road.net/upload/gray_marker.png',
    new kakao.maps.Size(33, 54),
    {
      offset: new kakao.maps.Point(16, 55),
    },
  );
  const savedMarkerImage = new kakao.maps.MarkerImage(
    'https://server.memory-road.net/upload/red_pin.png',
    new kakao.maps.Size(55, 54),
  );

  // 인포윈도우
  const infoWindow = new kakao.maps.InfoWindow({ zIndex: 0.9 });
  const infoWindowModal = new kakao.maps.InfoWindow({ zIndex: 1 });

  // 인포윈도우 기본 css 없애는 함수
  function removeInfoWindowStyle(htmlTag: any): void {
    htmlTag.parentElement.parentElement.style.border = '0px';
    htmlTag.parentElement.parentElement.style.background = 'unset';
    htmlTag.parentElement.previousSibling.style.display = 'none';
  }
  // marker modal css 지우기
  function removeInfoWindowMoalStyleAndAddStyle(htmlTag: any): void {
    htmlTag.parentElement.parentElement.style.border = '0px';
    htmlTag.parentElement.parentElement.style.background = 'unset';
    htmlTag.parentElement.previousSibling.style.display = 'none';
  }

  // 기존 데이터 useEffect
  useEffect(() => {
    if (pins.length <= 1) {
      axios({
        url: `https://server.memory-road.net/routes/${id}`,
        method: 'get',
        withCredentials: true,
      })
        .then((res) => {
          if (res.status === 200) {
            const route = res.data.route[0]; // 루트 정보.
            const pins = res.data.route[0].Pins;
            const initialPins = pins?.map(function (pinInfo: any) {
              const sh = Number(pinInfo.startTime?.split(':')[0]);
              const eh = Number(pinInfo.endTime?.split(':')[0]);
              const sm = Number(pinInfo.startTime?.split(':')[1]);
              const em = Number(pinInfo.endTime?.split(':')[1]);
              const yStart = sh * 2 + (sm === 0 ? 0 : 1);
              const yEnd = (eh - sh) * 2 + (em - sm < 0 ? -1 : 0);
              return {
                i: String(pinInfo.id),
                x: 0,
                y: yStart,
                w: 1,
                h: yEnd,
              };
            });
            setRoute(route); // 루트 정보 받아오기.
            setPins((prev) => prev.concat(pins));
            setItemState(initialPins);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  // 전체 지도 useEffect
  useEffect(() => {
    const mapContainer = document.getElementById('map');
    const mapOptions = {
      center: new kakao.maps.LatLng(37.566826, 126.9786567),
      level: currLevel,
      draggable: true,
      scrollwheel: true,
      disableDoubleClickZoom: true,
    };
    const map = new kakao.maps.Map(mapContainer, mapOptions);
    setKakaoMap(map);
  }, []);

  // 파란 마커 useEffect
  useEffect(() => {
    if (kakaoMap === null) {
      return;
    }
    if (blueMarker) {
      setBlueMarkers((blueMarker: any) => {
        if (blueMarker !== null) {
          blueMarker.setMap(null);
        }
        handleBlueMarker(false);
        return new kakao.maps.Marker({
          map: kakaoMap,
          position: new kakao.maps.LatLng(37.566826, 126.9786567),
          image: markerImage,
          clickable: true,
        });
      });
    }
    kakao.maps.event.addListener(kakaoMap, 'click', function (mouseEvent: any) {
      searchDetailAddrFromCoords(
        mouseEvent.latLng,
        function (result: any, status: any): void {
          let level, marker: any, markerInfo: any;
          if (status === kakao.maps.services.Status.OK) {
            level = kakaoMap.getLevel();
            const latlng = mouseEvent.latLng;
            const place = result[0].address;
            const latitude = sliceLatLng(latlng.Ma);
            const longitude = sliceLatLng(latlng.La);
            marker = new kakao.maps.Marker({
              map: kakaoMap,
              position: new kakao.maps.LatLng(latitude, longitude),
              image: markerImage,
              clickable: true,
            });
            markerInfo = {
              latitude, // 위도
              longitude, // 경도
              lotAddress: place.address_name, // 지번 주소
              roadAddress: !!place.road_address
                ? place.road_address.address_name
                : '', // 도로명 주소
              ward: place.region_2depth_name, // 지역 '구'
            };
            setBlueMarkers((blueMarker: any) => {
              // 마커 상태 관리
              if (blueMarker !== null) {
                blueMarker.setMap(null);
              }
              return marker;
            });
            setInfoModals((infoModal) => {
              if (infoModal.length !== 0) {
                infoModal.forEach((modal: any) => modal.close());
              }
              return [];
            });
          }
          kakao.maps.event.addListener(marker, 'click', function () {
            handleIsModalOpen();
            infoWindowModal.setContent(createPinModal);
            infoWindowModal.open(kakaoMap, marker);
            setInfoModals((infoModal) => infoModal.concat(infoWindowModal));
            const infoWindowModalHTMLTag = document.querySelector(
              '#createPinModal-background',
            );
            removeInfoWindowMoalStyleAndAddStyle(infoWindowModalHTMLTag);

            ReactDOM.render(
              <Provider store={store}>
                <ElementForCreate
                  currMarkerInfo={markerInfo}
                  handleIsModalOpen={handleIsModalOpen}
                  onAddItem={onAddItem}
                  setIsEmptyInfo={setIsEmptyInfo}
                />
              </Provider>,
              document.getElementById('createPinModal-background'),
            );
          });
          setCurrLevel(level);
          infoWindowModal.close();
        },
      );
    });
  }, [blueMarker]);

  // 회색 마커 useEffect
  useEffect(() => {
    if (kakaoMap === null) {
      return;
    }
    // 장소 검색
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(searchText, placesSearchCB);

    function placesSearchCB(data: any, status: any, _: any) {
      if (status === kakao.maps.services.Status.OK) {
        setGrayMarkers((grayMarker: any) => {
          if (grayMarker.length !== 0) {
            grayMarker.forEach((marker: any) => marker.setMap(null));
          }
          return [];
        });
        setInfoModals((infoModal) => {
          if (infoModal.length !== 0) {
            infoModal.forEach((modal: any) => modal.close());
          }
          return [];
        });
        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i]);
        }

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
      const latitude = sliceLatLng(place.y);
      const longitude = sliceLatLng(place.x);
      const markerForSearch = new kakao.maps.Marker({
        map: kakaoMap,
        position: new kakao.maps.LatLng(latitude, longitude),
        image: markerImageForSearch,
        clickable: true,
      });
      setGrayMarkers((grayMarker: any) => grayMarker.concat(markerForSearch));
      kakao.maps.event.addListener(markerForSearch, 'click', function () {
        handleIsModalOpen();
        infoWindowModal.setContent(createPinModal);
        infoWindowModal.open(kakaoMap, markerForSearch);
        setInfoModals((infoModal) => infoModal.concat(infoWindowModal));
        const infoWindowModalHTMLTag = document.querySelector(
          '#createPinModal-background',
        );
        removeInfoWindowMoalStyleAndAddStyle(infoWindowModalHTMLTag);

        const markerInfo: any = {
          latitude,
          longitude,
          lotAddress: place.address_name,
          roadAddress: !!place.road_address_name ? place.road_address_name : '',
          ward: place.address_name.split(' ')[1],
        };

        ReactDOM.render(
          <Provider store={store}>
            <ElementForCreate
              currMarkerInfo={markerInfo}
              handleIsModalOpen={handleIsModalOpen}
              onAddItem={onAddItem}
              setIsEmptyInfo={setIsEmptyInfo}
            />
          </Provider>,
          document.getElementById('createPinModal-background'),
        );
      });

      kakao.maps.event.addListener(markerForSearch, 'mouseover', function () {
        const content = InfoWindowContent(
          place.place_name,
          place.address_name,
          place.road_address_name,
        );
        infoWindow.setContent(content);
        infoWindow.open(kakaoMap, markerForSearch);
        const infoWindowHTMLTags = document.querySelectorAll(
          '.windowInfo-content-container',
        );
        removeInfoWindowStyle(infoWindowHTMLTags[0]);
      });

      kakao.maps.event.addListener(markerForSearch, 'mouseout', function () {
        infoWindow.close();
      });
    }
  }, [grayMarker, searchText]);

  // 빨간 핀 useEffect & 수정
  useEffect(() => {
    if (kakaoMap === null) {
      return;
    }
    // 시시각각 변하는 지도의 센터를 추적할 수 있음.
    kakao.maps.event.addListener(kakaoMap, 'idle', function () {
      const level = kakaoMap.getLevel();
      setCurrLevel(level);
    });

    const bounds = new kakao.maps.LatLngBounds();
    pins.map((el) =>
      bounds.extend(new kakao.maps.LatLng(el.latitude, el.longitude)),
    );

    const arrangedArr: any = itemState
      .sort((a: any, b: any) => a.y - b.y)
      .map((el: any) => el.i)
      .map((el) => {
        for (let i = 0; i < pins.length; i++) {
          if (String(pins[i].id) === el) {
            return pins[i];
          }
        }
      });

    setRedPins((redPins) => {
      redPins.forEach((pin) => pin.setMap(null));
      return [];
    });
    setPolylines((lines) => {
      lines.forEach((line) => line.setMap(null));
      return [];
    });
    setInfoModals((infoModal) => {
      if (infoModal.length !== 0) {
        infoModal.forEach((modal: any) => modal.close());
      }
      return [];
    });

    for (let i = 0; i < arrangedArr.length; i++) {
      if (arrangedArr[i]) {
        const currLat: any = arrangedArr[i].latitude;
        const currLng: any = arrangedArr[i].longitude;
        const savedMarker = new kakao.maps.Marker({
          map: kakaoMap,
          position: new kakao.maps.LatLng(currLat, currLng),
          image: savedMarkerImage,
          clickable: true,
        });
        setRedPins((redPins) => redPins.concat(savedMarker));
        if (i >= 1) {
          const prevLat: any = arrangedArr[i - 1].latitude;
          const prevLng: any = arrangedArr[i - 1].longitude;
          const linePath = [
            new kakao.maps.LatLng(prevLat, prevLng),
            new kakao.maps.LatLng(currLat, currLng),
          ];
          const polyline = new kakao.maps.Polyline({
            map: kakaoMap,
            path: linePath,
            strokeWeight: 5,
            strokeColor: '#eb3838',
            strokeOpacity: 0.7,
            strokeStyle: 'dashed',
          });
          setPolylines((lines) => lines.concat(polyline));
        }
        // 수정 모달창
        if (currModifiedID && String(arrangedArr[i].id) === currModifiedID) {
          kakaoMap.setBounds(bounds); // bound 설정
          handleIsModifyModalOpen();
          infoWindowModal.setContent(modifyPinModal);
          infoWindowModal.open(kakaoMap, savedMarker);
          setInfoModals((infoModal) => infoModal.concat(infoWindowModal));
          const infoWindowModalHTMLTag = document.querySelector(
            '#modifyPinModal-background',
          );
          removeInfoWindowMoalStyleAndAddStyle(infoWindowModalHTMLTag);
          const currInfoForModify = arrangedArr[i];
          const currFileForModify = pinImage[i];

          ReactDOM.render(
            <ElementForModify
              currFileForModify={currFileForModify}
              currInfoForModify={currInfoForModify}
              handleIsModifyModalOpen={handleIsModifyModalOpen}
              onUpdateItem={onUpdateItem}
              selectCurrModifedID={selectCurrModifedID}
            />,
            document.getElementById('modifyPinModal-background'),
          );
        }
      }
    }
  }, [itemState, currModifiedID]);

  return (
    <>
      <div id="map-whole-container">
        {isMoveToMypage ? (
          <ConfirmMoveToMypage setIsMoveToMypage={setIsMoveToMypage} />
        ) : null}
        {isEmptyInfo ? (
          <ConfirmPinIsEmptyModal setIsEmptyInfo={setIsEmptyInfo} />
        ) : null}
        {isSidebarSaveBtnClicked ? (
          <SaveRouteModalForModify
            handleSidebarSaveBtn={handleSidebarSaveBtn}
            pinImage={pinImage}
            pins={pins}
            route={route}
            routeId={id}
            setIsMoveToMypage={setIsMoveToMypage}
            totalTime={totalTime}
          />
        ) : null}
        <div id="map-navigator-top">
          <Navigation />
          <TimeLineSideBar
            createElement={createElement}
            handleSidebarSaveBtn={handleSidebarSaveBtn}
            itemState={itemState}
            onLayoutChange={onLayoutChange}
          />
          <SearchPinBar
            getSearchText={getSearchText}
            handleBlueMarker={handleBlueMarker}
            handleGrayMarker={handleGrayMarker}
            handleIsModalOpen={handleIsModalOpen}
            handleIsModifyModalOpen={handleIsModifyModalOpen}
          />
        </div>
        <div id="map"></div>
      </div>
    </>
  );
}

export default ModifyPinMap;
