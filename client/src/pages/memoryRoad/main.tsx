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
  DotsToMove,
  FooterBackground,
  FooterGitHubLinks,
  FooterButton,
} from './main_sections';
import { titleAndContent, sidebarBoxContent } from './dummyData';

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

  return (
    <>
      <div
        className="mainpage-container"
        onScroll={() => console.log('scroll')}
      >
        <Navigation />
        <section className="mainpage-section" id="mainpage-first">
          <div className="mainpage-text-section">
            <TextSection
              content={titleAndContent.first.content}
              isCurrSection={currSectIdx === 0 ? true : false}
              isScrollDown={isScrollDown}
              title={titleAndContent.first.title}
            />
            <DotsToMove
              isCurrSection={currSectIdx === 0 ? true : false}
              isScrollDown={isScrollDown}
              num={0}
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
            <DotsToMove
              isCurrSection={currSectIdx === 4 ? true : false}
              isScrollDown={isScrollDown}
              num={1}
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
          <FooterButton
            isCurrSection={currSectIdx === 5 ? true : false}
            isScrollDown={isScrollDown}
            num={0}
          />
          <FooterButton
            isCurrSection={currSectIdx === 5 ? true : false}
            isScrollDown={isScrollDown}
            num={1}
          />
          <FooterGitHubLinks
            isCurrSection={currSectIdx === 5 ? true : false}
            isScrollDown={isScrollDown}
          />
          <FooterBackground
            isCurrSection={currSectIdx === 5 ? true : false}
            isScrollDown={isScrollDown}
          />
        </section>
      </div>
    </>
  );
}

export default Main;
