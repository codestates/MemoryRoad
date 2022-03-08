import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducer';
import './main.css';

interface TextProps {
  title: string;
  content: string[];
  isCurrSection: boolean;
  isScrollDown: boolean;
}

interface ComponentProps {
  isCurrSection: boolean;
  isScrollDown: boolean;
}

interface SidebarProps {
  locationName: string;
  time: string;
  emphasize: boolean;
  style?: string;
  isCurrSection: boolean;
  isScrollDown: boolean;
}

// common
export function TextSection({
  title,
  content,
  isCurrSection,
  isScrollDown,
}: TextProps) {
  return (
    <>
      <p
        className={`textSection-text-title ${
          isCurrSection && isScrollDown ? 'line-up' : ''
        } ${
          isCurrSection ? 'mainpage-opacity-true' : 'mainpage-opacity-false'
        }`}
      >
        {title}
      </p>
      {content.map((item, idx) => (
        <p
          className={`textSection-text-content ${
            isCurrSection && isScrollDown ? 'line-up' : ''
          } ${
            isCurrSection ? 'mainpage-opacity-true' : 'mainpage-opacity-false'
          }`}
          key={idx}
        >
          {item}
        </p>
      ))}
    </>
  );
}
// first
export function SavePinSkeleton({
  isCurrSection,
  isScrollDown,
}: ComponentProps) {
  const pinImages = [
    'http://localhost:5500/server/upload/KakaoTalk_20210421_115439308_17.jpg',
    'http://localhost:5500/server/upload/KakaoTalk_20210421_115439308_16.jpg',
    'http://localhost:5500/server/upload/KakaoTalk_20210421_115439308_13.jpg',
  ];
  return (
    <>
      <div className="savePinSkeleton-container-box">
        <div
          className={`background-shadow ${
            isCurrSection && isScrollDown ? 'line-up-component-right' : ''
          } ${
            isCurrSection ? 'mainpage-opacity-true' : 'mainpage-opacity-false'
          }`}
          id="savePinSkeleton-background"
        >
          <div id="savePinSkeleton-container">
            <div className="savePinSkeleton-title">
              제목 <b className="text-highlight">*</b>
            </div>
            <input
              className="savePinSkeleton-input"
              disabled
              placeholder="내가 좋아하는 원두가 있는 곳"
            />
            <div className="savePinSkeleton-title">
              사진 첨부
              <form id="file-upload-form" name="chooseImgFilesForm">
                <div className="savePinSkeleton-input addImgFilesBtn">
                  <label htmlFor="file-upload" id="file-upload-image">
                    <img
                      alt="icon"
                      src="https://server.memory-road.net/upload/addPhoto_icon.png"
                      width="40"
                    />
                  </label>
                </div>
              </form>
            </div>
            <div id="savePinSkeleton-pictures-background">
              <div id="savePinSkeleton-pictures-container">
                {pinImages.map((el, idx) => (
                  <div className="savePinSkeleton-picture-box" key={idx}>
                    <button
                      className="savePinSkeleton-delete-picture"
                      type="button"
                    >
                      <img
                        alt="closeImage"
                        className="savePinSkeleton-close-btn"
                        src="https://server.memory-road.net/upload/close_icon.png"
                      ></img>
                    </button>
                    <img
                      alt="uploadPicture"
                      className="savePinSkeleton-picture"
                      src={el}
                    ></img>
                  </div>
                ))}
              </div>
            </div>
            <button id="savePinSkeleton-save-btn">장소 저장</button>
          </div>
        </div>
        <div
          className={`background-shadow ${
            isCurrSection && isScrollDown ? 'line-up-component-bottom' : ''
          } ${
            isCurrSection ? 'mainpage-opacity-true' : 'mainpage-opacity-false'
          }`}
          id="savePinSkeleton-marker-image"
        />
      </div>
    </>
  );
}

export function MapSkeleton1({ isCurrSection, isScrollDown }: ComponentProps) {
  return (
    <>
      <div
        className={`background-shadow ${
          isCurrSection && isScrollDown ? 'line-up-component-left' : ''
        } ${
          isCurrSection ? 'mainpage-opacity-true' : 'mainpage-opacity-false'
        }`}
        id="savePinSkeleton-map-image"
      />
    </>
  );
}
// second
export function SidebarSkeleton({
  isCurrSection,
  isScrollDown,
}: ComponentProps) {
  return (
    <>
      <div
        className={`background-shadow ${
          isCurrSection && isScrollDown ? 'line-up-component-bottom' : ''
        } ${
          isCurrSection ? 'mainpage-opacity-true' : 'mainpage-opacity-false'
        }`}
        id="savePinSkeleton-sidebar-image"
      />
    </>
  );
}

export function SidebarBoxSkeleton({
  locationName,
  time,
  emphasize,
  style,
  isCurrSection,
  isScrollDown,
}: SidebarProps) {
  return (
    <>
      <div
        className={`pinCard-container mainpage-pinCard ${
          emphasize ? 'mainpage-pinCard-green background-shadow' : null
        } ${style === 'style1' ? 'change-style1' : null} ${
          style === 'style2' ? 'change-style2' : null
        } ${isCurrSection && isScrollDown ? 'line-up-component-right' : ''} ${
          isCurrSection ? 'mainpage-opacity-true' : 'mainpage-opacity-false'
        }`}
      >
        <div className="pinCard-title">{locationName}</div>
        {emphasize ? (
          <div className="pinCard-btn-container">
            <button className="mainpage-pinCard-delete-btn">삭제</button>
            <button className="mainpage-pinCard-modify-btn">수정</button>
          </div>
        ) : (
          <div className="pinCard-time-container">
            <div className="pinCard-time-calculate">{time}</div>
            시간
          </div>
        )}
      </div>
    </>
  );
}
// third
export function StorycardSkeleton({
  isCurrSection,
  isScrollDown,
}: ComponentProps) {
  const colorUrls: any = useSelector(
    (state: RootState) => state.createRouteReducer.colorDotUrl,
  );
  const colorChips: any = useSelector(
    (state: RootState) => state.createRouteReducer.colorChip,
  );
  const pins = [
    { locationName: '내가 좋아하는 원두가 있는 곳 ☕' },
    { locationName: '햇살 맛집 ! 🌄' },
    { locationName: '크로와상이 맛있음 🥐' },
    { locationName: '밀크티와 타르트의 조화 🥧' },
  ];
  return (
    <>
      <div
        className={`myRouteStore-card-container background-shadow mainpage-storycard-align ${
          isCurrSection && isScrollDown ? 'line-up-component-right' : ''
        } ${
          isCurrSection ? 'mainpage-opacity-true' : 'mainpage-opacity-false'
        }`}
      >
        <div className="myRouteStore-card-top">
          <img
            alt="testImg"
            className="myRouteStore-card-image"
            src="http://localhost:5500/server/upload/KakaoTalk_20210421_115439308_13.jpg"
          ></img>
        </div>
        <div className="myRouteStore-card-bottom">
          <div className="myRouteStore-card-title">
            <p className="myRouteStore-card-text">좋아하는 카페 모음집</p>
            <div className="myRouteStore-card-time-container">
              <div className="myRouteStore-card-time">5</div>
              시간
            </div>
          </div>
          <div className="myRouteStore-card-date">2022.02.01</div>
          <div className="myRouteStore-card-route">
            {pins.map((el: any, idx: any) => (
              <div className="myRouteStore-card-pin" key={idx}>
                <img
                  alt="tt"
                  className="myRouteStore-card-dot"
                  src={colorUrls[5]}
                ></img>
                <p className="myRouteStore-card-dot-title">{el.locationName}</p>
              </div>
            ))}
            <div
              className="myRouteStore-card-dot-line"
              style={{
                backgroundColor: `${colorChips[5]}`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}

export function ColorSelectBox({
  isCurrSection,
  isScrollDown,
}: ComponentProps) {
  const colorUrls: any = useSelector((state: RootState) =>
    state.createRouteReducer.colorDotUrl.slice(7, 10),
  );
  return (
    <>
      <div
        className={`selectbox-color btn-active mainpage-colorSelectbox-position ${
          isCurrSection && isScrollDown ? 'line-up-component-left' : ''
        } ${
          isCurrSection ? 'mainpage-opacity-true' : 'mainpage-opacity-false'
        }`}
      >
        <button className="selectbox-color-label">
          <img
            alt="selected-dot"
            className="selectbox-color-selected-option"
            src={'https://server.memory-road.net/upload/gray_dot.png'}
          />
        </button>
        <ul className="selectbox-color-optionList background-shadow">
          {colorUrls.map((color: any, idx: number) => {
            const strArr = color.split('/');
            return (
              <li className="selectbox-color-option" key={idx}>
                <img
                  alt={strArr[6]}
                  className="selectbox-color-img"
                  src={color}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export function WardSelectBox({ isCurrSection, isScrollDown }: ComponentProps) {
  const wards = useSelector(
    (state: RootState): Array<string> =>
      state.createRouteReducer.wards.slice(12, 16),
  );
  return (
    <>
      <div
        className={`selectbox-ward map btn-active mainpage-wardSelectbox-position ${
          isCurrSection && isScrollDown ? 'line-up-component-left' : ''
        } ${
          isCurrSection ? 'mainpage-opacity-true' : 'mainpage-opacity-false'
        }`}
      >
        <button className="selectbox-ward-label">
          <p className="selectbox-ward-selected-option">전체 구</p>
        </button>
        <ul className="selectbox-ward-optionList background-shadow">
          {wards.map((el, idx) => (
            <li className="selectbox-ward-option" key={idx}>
              {el}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
// forth
export function MapPolyLineSkeleton({
  isCurrSection,
  isScrollDown,
}: ComponentProps) {
  return (
    <>
      <div
        className={`background-shadow ${
          isCurrSection && isScrollDown ? 'line-up-component-right' : ''
        } ${
          isCurrSection ? 'mainpage-opacity-true' : 'mainpage-opacity-false'
        }`}
        id="savePinSkeleton-map-image"
      />
    </>
  );
}
// fifth
export function SearchBarSkeleton({
  isCurrSection,
  isScrollDown,
}: ComponentProps) {
  return (
    <>
      <div
        className={`mainpage-searchBar-container ${
          isCurrSection && isScrollDown ? 'line-up-component-right' : ''
        } ${
          isCurrSection ? 'mainpage-opacity-true' : 'mainpage-opacity-false'
        }`}
      >
        <div className="searchPin-background">
          <div id="searchPin-container-sy">
            <input
              className="searchPin-input"
              placeholder="원하는 장소를 검색해보세요 !"
            />
            <button className="searchPin-search-btn">검색</button>
          </div>
        </div>
      </div>
    </>
  );
}

export function ColorChips({ isCurrSection, isScrollDown }: ComponentProps) {
  return (
    <>
      <div
        className={`mainpage-map-colorchip-background ${
          isCurrSection && isScrollDown ? 'line-up-component-bottom' : ''
        } ${
          isCurrSection ? 'mainpage-opacity-true' : 'mainpage-opacity-false'
        }`}
      >
        <div className="mainpage-map-colorchip color-first"></div>
        <div className="mainpage-map-colorchip color-second"></div>
        <div className="mainpage-map-colorchip color-third"></div>
        <div className="mainpage-map-colorchip color-fourth"></div>
      </div>
    </>
  );
}

export function PinContentSkeleton({
  isCurrSection,
  isScrollDown,
}: ComponentProps) {
  return (
    <>
      <div
        className={`mainpage-pinContent-container ${
          isCurrSection && isScrollDown ? 'line-up-component-left' : ''
        } ${
          isCurrSection ? 'mainpage-opacity-true' : 'mainpage-opacity-false'
        }`}
      >
        <div className="createPinModal-background">
          <div className="windowInfo-content-container">
            <div className="windowInfo-content-section">
              <div className="windowInfo-content-title">장소 이름</div>
              <div className="windowInfo-content-property">
                내가 좋아하는 원두가 있는 곳
              </div>
            </div>
            <div className="windowInfo-content-section">
              <div className="windowInfo-content-title">지번 주소</div>
              <div className="windowInfo-content-property">
                서울 종로구 계동 222-22
              </div>
            </div>
            <div className="windowInfo-content-section">
              <div className="windowInfo-content-title">도로명 주소</div>
              <div className="windowInfo-content-property">
                서울 종로구 북촌로 5길 22
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function SelectBoxCustom1({
  isCurrSection,
  isScrollDown,
}: ComponentProps) {
  return (
    <>
      <div
        className={`mainpage-selectbox-custom-1 ${
          isCurrSection && isScrollDown ? 'line-up-component-right' : ''
        } ${
          isCurrSection ? 'mainpage-opacity-true' : 'mainpage-opacity-false'
        }`}
      >
        루트
      </div>
    </>
  );
}

export function SelectBoxCustom2({
  isCurrSection,
  isScrollDown,
}: ComponentProps) {
  return (
    <>
      <div
        className={`mainpage-selectbox-custom-2 ${
          isCurrSection && isScrollDown ? 'line-up-component-right' : ''
        } ${
          isCurrSection ? 'mainpage-opacity-true' : 'mainpage-opacity-false'
        }`}
      >
        장소
      </div>
    </>
  );
}

export function AllRouteButton({
  isCurrSection,
  isScrollDown,
}: ComponentProps) {
  return (
    <>
      <div
        className={`mainpage-all-route-button ${
          isCurrSection && isScrollDown ? 'line-up-component-bottom' : ''
        } ${
          isCurrSection ? 'mainpage-opacity-true' : 'mainpage-opacity-false'
        }`}
      >
        전체
        <br />
        루트
        <br /> 보기
      </div>
    </>
  );
}
export function MapSkeleton2({ isCurrSection, isScrollDown }: ComponentProps) {
  return (
    <>
      <div
        className={`background-shadow ${
          isCurrSection && isScrollDown ? 'line-up-component-bottom' : ''
        } ${
          isCurrSection ? 'mainpage-opacity-true' : 'mainpage-opacity-false'
        }`}
        id="savePinSkeleton-map-image-fifth"
      />
    </>
  );
}
