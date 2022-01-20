import React, { useEffect } from 'react';
import './home.css';
import Footer from '../components/footer/footer';
import { contextType } from 'react-grid-layout';
import { useNavigate } from 'react-router-dom';
function Home() {
  const navigate = useNavigate();
  // 스크롤 이벤트 발생
  window.onscroll = function (e) {
    const scrollheight = document.documentElement.scrollTop;
    const viewheight = window.innerHeight;
    const allheight = document.documentElement.scrollHeight;
    const scollbarLocation = ((scrollheight + viewheight) / allheight) * 100;
    // console.log('스크롤 높이', scrollheight);
    // console.log('보고있는 화면 높이', viewheight);
    // console.log('전체문서 높이', allheight);
    // console.log('% :', scollbarLocation);
    const homeguide = document.querySelector('.Home-guide2');
    const homeButton = document.querySelector('.Home-button');
    const homeButton2 = document.querySelector('.Home-button2');
    if (scollbarLocation > 80) {
      homeguide?.classList.add('Home-guideEffect');
      homeButton?.classList.add('Home-ButtonEffect');
      homeButton2?.classList.add('Home-ButtonEffect');
    }
    e.stopPropagation();
  };

  return (
    <div>
      <div className="Home-Contents">
        <div className="Home-notgrid">
          <div className="Home-checking">
            <div className="Home-MemoryRoad">MEMORYROAD</div>
          </div>
          <div>
            <div className="Home-checking Home-MemoryRoadBorder">
              <div className="Home-MemoryRoadcontent">
                <div id="Home-message1">기억하고 싶은 하루가 있으신가요?</div>
                <br />
                <div id="Home-message2">
                  오늘은 뭐하고 놀지 계획 세우기 귀찮으신가요?
                </div>
                <br />
                <div id="Home-message3">
                  옛날 사진을 찾아 갤러리를 헤매고 계신가요?
                </div>
              </div>
              <br />
              <div className="Home-guide">메모리로드가 도와드릴게요.</div>
            </div>
          </div>
        </div>
        <div className="Home-checking"></div>

        <div>
          <div className="Home-checking Home-grid1">
            <div className="Home-number">1</div>
            <div className="Home-titleContent">
              <div className="Home-title">루트와 사진</div>
              <div className="Home-content2">
                원하는 장소에 사진을 담아 하나의 루트를 만들어 보세요.
              </div>
            </div>
          </div>
          <div>
            <img
              alt="introduce"
              className="Home-introduce"
              src="https://server.memory-road.net/upload/AllRouteMap.jpg"
            />
          </div>
          <hr className="Home-line" />
        </div>
        <div className="Home-checking"></div>
        <div className="Home-checking"></div>
        <div className="Home-checking">
          <div className="Home-checking Home-grid1">
            <div className="Home-number">2</div>
            <div className="Home-titleContent">
              <div className="Home-title">스토리 카드</div>
              <div className="Home-content2">
                저장된 루트는 하나의 카드로 보관할 수 있습니다.
              </div>
            </div>
          </div>
          <div>
            <img
              alt="introduce"
              className="Home-introduce"
              src="https://server.memory-road.net/upload/AllRouteMap.jpg"
            />
          </div>
          <hr className="Home-line" />
        </div>
        <div className="Home-checking"></div>
        <div className="Home-checking"></div>
        <div className="Home-checking">
          <div className="Home-checking Home-grid1">
            <div className="Home-number">3</div>
            <div className="Home-titleContent">
              <div className="Home-title">루트 검색</div>
              <div className="Home-content2">
                다양한 키워드로 공유된 루트를 검색해보세요
              </div>
            </div>
          </div>
          <div>
            <img
              alt="introduce"
              className="Home-introduce"
              src="https://server.memory-road.net/upload/AllRouteMap.jpg"
            />
          </div>
        </div>
        <div className="Home-checking"></div>
        <div></div>
        <div className=" Home-lastBorder">
          <div className="Home-MemoryRoadBorder2">
            <div className="Home-guide2">체험할 준비가 되셨나요?</div>
            <div>
              <button
                className="Home-button"
                onClick={() => {
                  navigate('map/createRoute');
                }}
              >
                메모리로드 <span>기록</span> 하러 가기
              </button>
            </div>
            <div>
              <button
                className="Home-button Home-button2"
                onClick={() => {
                  navigate('/searchRoutes');
                }}
              >
                메모리로드 <span>검색</span> 하러 가기
              </button>
            </div>
          </div>
        </div>
        <div id="bottom"></div>
      </div>
      <Footer />

      <div className="Home-topdownButtonPosition">
        <div>
          <button
            className="Home-topdownButton"
            onClick={() => window.scroll(0, 0)}
          >
            <i className="fas fa-chevron-up"></i>
          </button>
        </div>
        <div>
          {/* top버튼 */}
          <button
            className="Home-topdownButton"
            onClick={() =>
              window.scrollTo(0, document.documentElement.scrollHeight)
            }
          >
            <i className="fas fa-chevron-down"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
