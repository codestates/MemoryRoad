import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducer';
import './storyCardMainModal.css';
import axios from 'axios';

const { kakao }: any = window;

function StoryCardMainModal({ handleCardModalClose, routeInfo }: any) {
  console.log(routeInfo);
  const pins = routeInfo.Pins;
  const colorUrls: any = useSelector(
    (state: RootState) => state.createRouteReducer.colorDotUrl,
  );
  const colorNames: any = useSelector(
    (state: RootState) => state.createRouteReducer.colorName,
  );
  const colorChips: any = useSelector(
    (state: RootState) => state.createRouteReducer.colorChip,
  );
  const colorIdx = colorNames.indexOf(routeInfo.color);
  const [pinId, setPinId] = useState(1);
  const [isResizing, setIsResizing] = useState(false);
  const handlePinId = (currPinId: number) => {
    setPinId(Number(currPinId));
  };
  /* resize이벤트 속도 조절 */
  let timer: any = null;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setIsResizing(!isResizing);
    }, 500);
  });
  // 지도에 표시할 점 이미지 생성
  const imageSrc = colorUrls[colorIdx];
  const imageSize = new kakao.maps.Size(14, 14);
  const imageOption = { offset: new kakao.maps.Point(6, 8) };
  const markerImage = new kakao.maps.MarkerImage(
    imageSrc,
    imageSize,
    imageOption,
  );

  const requestForDelete = () => {
    axios({
      url: `https://server.memory-road.net/routes/${routeInfo.id}`,
      method: 'delete',
      withCredentials: true,
    })
      .then((res) => {
        console.log(res);
        // handleCardModalClose();
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const mapContainer = document.getElementById('storyCard-map');
    const mapOption = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
      maxLevel: 7,
      // draggable: false,
      // zoomable: false,
    };
    const map = new kakao.maps.Map(mapContainer, mapOption);
    const bounds = new kakao.maps.LatLngBounds();
    const setBounds = () => {
      map.setBounds(bounds);
    };

    pins.forEach((el: any, idx: any, arr: any) => {
      // 이미지 add한 마커
      const position = new kakao.maps.LatLng(el.latitude, el.longitude);
      const marker = new kakao.maps.Marker({
        image: markerImage,
        position: position, // 현재 위치 상태 업데이트 반영
        clickable: true, // 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정
      });
      if (idx > 0) {
        const prevLocation = new kakao.maps.LatLng(
          arr[idx - 1].latitude,
          arr[idx - 1].longitude,
        );
        const currLocation = position;
        const linePath = [prevLocation, currLocation];
        const ployline = new kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 3,
          strokeColor: colorChips[colorIdx],
          strokeOpacity: 0.4,
          strokeStyle: 'solid',
        });
        ployline.setMap(map);
      }
      marker.setMap(map);
      bounds.extend(position);
    });

    setBounds();
  }, [isResizing]);
  return (
    <>
      <div className="storyCardMainModal-background">
        <div className="storyCardMainModal-entire-container">
          <div className="storyCardMainModal-container">
            <div className="storyCardMainModal-headerBox">
              <div className="storyCardMainModal-close-btn-wrapper">
                <button
                  className="storyCardMainModal-close-btn"
                  onClick={handleCardModalClose}
                ></button>
              </div>
              <p className="storyCardMainModal-title">{routeInfo.routeName}</p>
              <div className="storyCardMainModal-btns">
                <Link to={`route/${routeInfo.id}`}>
                  <button className="storyCardMainModal-modify-btn">
                    루트 수정
                  </button>
                </Link>
                <button
                  className="storyCardMainModal-delete-btn"
                  onClick={() => {
                    requestForDelete();
                    handleCardModalClose();
                  }}
                >
                  루트 삭제
                </button>
              </div>
              <hr className="storyCardMainModal-divide-line" />
              {/* 여기 스크롤 */}
            </div>
            <div className="storyCardMainModal-main-content">
              <p className="storyCardMainModal-description">
                {routeInfo.description}
              </p>
              <hr className="storyCardMainModal-divide-line" />
              <div className="storyCardMainModal-map-wrapper">
                <div className="storyCardMainModal-map">
                  <div id="storyCard-map">
                    {/*지도 위에 마커랑 선 표시 infoWindow 이벤트까지.*/}
                  </div>
                </div>
              </div>

              <div className="storyCardMainModal-route-wrapper">
                <div className="storyCardMainModal-route">
                  {pins.map((el: any, idx: any) => (
                    <div
                      className="storyCardMainModal-pin"
                      id={String(el.id)}
                      key={idx}
                    >
                      <button
                        className="storyCardMainModal-pin-picture-count"
                        onClick={() => handlePinId(el.id)}
                      >
                        {el.Pictures.length}
                      </button>
                      <button
                        className="storyCardMainModal-pin-map-dot"
                        onClick={() => handlePinId(el.id)}
                        style={{
                          background: `url(${colorUrls[colorIdx]}) no-repeat center`,
                          backgroundSize: 'cover',
                        }}
                      ></button>

                      <div className="storyCardMainModal-pin-time">
                        {el.startTime} ~ {el.endTime}
                      </div>
                      <div className="storyCardMainModal-pin-title">
                        {el.locationName}
                      </div>
                    </div>
                  ))}
                </div>
                <hr
                  className="storyCardMainModal-pin-color-line"
                  style={{ backgroundColor: `${colorChips[colorIdx]}` }}
                />
              </div>

              <div className="storyCardMainModal-pin-pictures">
                {pins[pinId - 1].Pictures.map((el: any, idx: any) => (
                  <div
                    className="storyCardMainModal-pin-photo-wrapper"
                    key={idx}
                  >
                    <div className="storyCardMainModal-pin-photo-container">
                      <div className="storyCardMainModal-pin-photo-center">
                        <img
                          alt={`${el.fileName}`}
                          className="storyCardMainModal-pin-photo-img"
                          src={`http://127.0.0.1:5500/client/public/img/${el.fileName}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StoryCardMainModal;
