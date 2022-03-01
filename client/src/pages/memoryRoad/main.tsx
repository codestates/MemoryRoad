import React, { useState, useRef, useEffect } from 'react';
import './main.css';
import Navigation from '../../components/navigation/Navigation'; // 일단 보류 디자인 바뀔 수 있음
import {
  SavePinSkeleton,
  MapSkeleton1,
  MapSkeleton2,
  TextSection,
  SidebarSkeleton,
  SidebarBoxSkeleton,
  StorycardSkeleton,
  ColorSelectBox,
  WardSelectBox,
  MapPolyLineSkeleton,
  SearchBarSkeleton,
  ColorChips,
  PinContentSkeleton,
  SelectBoxCustom1,
  SelectBoxCustom2,
  AllRouteButton,
} from './componentMR';

import { useHeight } from './customHook';

function Main() {
  const { docsHeight } = useHeight();
  const [isScrollDown, setIsScrollDown] = useState<boolean>(true);
  const [currSectIdx, setCurrSectIdx] = useState<number>(0);
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    const elementsArray = document.querySelectorAll('.mainpage-section');
    let mounted = true;
    let timer: any = null;
    window.addEventListener('scroll', () => {
      if (mounted) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          // scroll top
          if (window.pageYOffset === 0) {
            setCurrSectIdx(0);
          }
          // scroll bottom
          else if (
            window.pageYOffset ===
            (elementsArray.length - 1) * docsHeight
          ) {
            setCurrSectIdx(elementsArray.length - 1);
          }
          // scroll down
          else if (
            window.pageYOffset &&
            currSectIdx * docsHeight < window.pageYOffset &&
            window.pageYOffset < (currSectIdx + 1) * docsHeight
          ) {
            setIsScrollDown(true);
            setCurrSectIdx((prev) => {
              const curr = prev + 1;
              if (elementsArray[curr] !== undefined) {
                window.scrollBy({
                  top: elementsArray[curr].getBoundingClientRect().top,
                  behavior: 'smooth',
                });
              }
              return curr;
            });
          }
          // scroll up
          else if (
            window.pageYOffset &&
            window.pageYOffset < currSectIdx * docsHeight
          ) {
            setIsScrollDown(false);
            setCurrSectIdx((curr) => {
              const prev = curr - 1;
              if (elementsArray[prev] !== undefined) {
                window.scrollBy({
                  top: elementsArray[prev].getBoundingClientRect().top,
                  behavior: 'smooth',
                });
              }
              return prev;
            });
          }
          setScrollY(window.pageYOffset);
        }, 100);
      }
    });
    return () => {
      mounted = false;
    };
  }, [scrollY, isScrollDown]);

  const titleAndContent = {
    first: {
      title: '사진, 기록해보세요 !',
      content: [
        '사진 한장을 찾아 갤러리를 해매보신 경험이 있나요 ?',
        '메모리로드는 사진과 장소를 함께 저장하는 기록 웹입니다.',
        '원하는 장소에 마커를 찍어 사진을 저장해보세요.',
      ],
    },
    second: {
      title: '시간과 순서, 자유롭게 조절해보세요.',
      content: [
        '생성된 박스의 크기를 늘이거나 줄여보세요. 시간 조절이 가능합니다.',
        '생성된 박스의 위치를 위 아래로 옮겨보세요. 순서 조절이 가능합니다.',
        '박스에 저장된 사진과 문구를 수정하거나 삭제할 수 있는 기능 또한 제공합니다.',
      ],
    },
    third: {
      title: '스토리카드로 관리하세요.',
      content: [
        '저장된 사진은 장소와 함께 기록됩니다.',
        '원하는 색상으로 사진 카테고리를 분류해보세요.',
        '흩어진 사진들을 지역구 기준으로 모아보세요.',
      ],
    },
    fourth: {
      title: '지도 중심으로 사진을 모아보세요.',
      content: [
        '스토리카드에 기록된 장소와 사진이 지도에 함께 표시됩니다.',
        '전체 루트를 한 눈에 볼 수 있습니다.',
        '마이페이지에서 확인해보세요 !',
      ],
    },
    fifth: {
      title: '타인의 스토리카드를 검색해보세요 !',
      content: [
        '공유된 스토리카드를 보며 타인의 시선을 따라가보세요.',
        '표시된 장소의 개수에 따라 색으로 분포도를 알려드립니다. (준비중)',
        '필터링 기능을 통해 가장 매력적인 루트를 찾아보세요 :)',
      ],
    },
  };

  const sidebarBoxContent = [
    {
      emphasize: false,
      locationName: '친구 만난 거리 🍀',
      time: '1',
      style: '',
    },
    {
      emphasize: true,
      locationName: '마라탕 맛집 🍜',
      time: '1.5',
      style: '',
    },
    {
      emphasize: false,
      locationName: '귀여운 편집샵 💜',
      time: '0.5',
      style: 'style1',
    },
    {
      emphasize: false,
      locationName: '자전거 대여 🌝',
      time: '0.5',
      style: 'style2',
    },
  ];

  return (
    <>
      <div
        className="mainpage-container"
        onScroll={() => console.log('scroll')}
      >
        <section className="mainpage-section" id="mainpage-first">
          <div className="mainpage-text-section">
            <TextSection
              content={titleAndContent.first.content}
              isCurrSection={currSectIdx === 0 ? true : false}
              isScrollDown={isScrollDown}
              title={titleAndContent.first.title}
            />
          </div>
          <div className="mainpage-image-section">
            <SavePinSkeleton
              isCurrSection={currSectIdx === 0 ? true : false}
              isScrollDown={isScrollDown}
            />
            <MapSkeleton1
              isCurrSection={currSectIdx === 0 ? true : false}
              isScrollDown={isScrollDown}
            />
          </div>
        </section>
        <section className="mainpage-section" id="mainpage-second">
          <div className="mainpage-image-section">
            <div className="mainpage-sidebar-box-container">
              {sidebarBoxContent.map((content, idx) => (
                <SidebarBoxSkeleton
                  emphasize={content.emphasize}
                  isCurrSection={currSectIdx === 1 ? true : false}
                  isScrollDown={isScrollDown}
                  key={idx}
                  locationName={content.locationName}
                  style={content.style ? content.style : ''}
                  time={content.time}
                />
              ))}
            </div>
            <SidebarSkeleton
              isCurrSection={currSectIdx === 1 ? true : false}
              isScrollDown={isScrollDown}
            />
          </div>
          <div className="mainpage-text-section">
            <TextSection
              content={titleAndContent.second.content}
              isCurrSection={currSectIdx === 1 ? true : false}
              isScrollDown={isScrollDown}
              title={titleAndContent.second.title}
            />
          </div>
        </section>
        <section className="mainpage-section" id="mainpage-third">
          <div className="mainpage-text-section">
            <TextSection
              content={titleAndContent.third.content}
              isCurrSection={currSectIdx === 2 ? true : false}
              isScrollDown={isScrollDown}
              title={titleAndContent.third.title}
            />
          </div>
          <div className="mainpage-image-section">
            <StorycardSkeleton
              isCurrSection={currSectIdx === 2 ? true : false}
              isScrollDown={isScrollDown}
            />
            <ColorSelectBox
              isCurrSection={currSectIdx === 2 ? true : false}
              isScrollDown={isScrollDown}
            />
            <WardSelectBox
              isCurrSection={currSectIdx === 2 ? true : false}
              isScrollDown={isScrollDown}
            />
          </div>
        </section>
        <section className="mainpage-section" id="mainpage-fourth">
          <div className="mainpage-image-section">
            <MapPolyLineSkeleton
              isCurrSection={currSectIdx === 3 ? true : false}
              isScrollDown={isScrollDown}
            />
          </div>
          <div className="mainpage-text-section">
            <TextSection
              content={titleAndContent.fourth.content}
              isCurrSection={currSectIdx === 3 ? true : false}
              isScrollDown={isScrollDown}
              title={titleAndContent.fourth.title}
            />
          </div>
        </section>
        <section className="mainpage-section" id="mainpage-fifth">
          <div className="mainpage-text-section">
            <TextSection
              content={titleAndContent.fifth.content}
              isCurrSection={currSectIdx === 4 ? true : false}
              isScrollDown={isScrollDown}
              title={titleAndContent.fifth.title}
            />
          </div>
          <div className="mainpage-image-section mainpage-align-fifth">
            <div className="mainpage-rotate-section">
              <SearchBarSkeleton
                isCurrSection={currSectIdx === 4 ? true : false}
                isScrollDown={isScrollDown}
              />
              <ColorChips
                isCurrSection={currSectIdx === 4 ? true : false}
                isScrollDown={isScrollDown}
              />
              <PinContentSkeleton
                isCurrSection={currSectIdx === 4 ? true : false}
                isScrollDown={isScrollDown}
              />
              <SelectBoxCustom1
                isCurrSection={currSectIdx === 4 ? true : false}
                isScrollDown={isScrollDown}
              />
              <SelectBoxCustom2
                isCurrSection={currSectIdx === 4 ? true : false}
                isScrollDown={isScrollDown}
              />
              <AllRouteButton
                isCurrSection={currSectIdx === 4 ? true : false}
                isScrollDown={isScrollDown}
              />
              <MapSkeleton2
                isCurrSection={currSectIdx === 4 ? true : false}
                isScrollDown={isScrollDown}
              />
            </div>
          </div>
        </section>
        <section className="mainpage-section" id="mainpage-seventh">
          Footer
        </section>
      </div>
    </>
  );
}

export default Main;
