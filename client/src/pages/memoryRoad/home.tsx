import React, { useEffect } from 'react';
import './home.css';
import Footer from '../../components/footer/footer';
import { contextType } from 'react-grid-layout';
import { useNavigate } from 'react-router-dom';
function Home({ url }: any) {
  const navigate = useNavigate();
  // 스크롤 이벤트 발생
  // window.onscroll = function (e) {
  //   const scrollheight = document.documentElement.scrollTop;
  //   const viewheight = window.innerHeight;
  //   const allheight = document.documentElement.scrollHeight;
  //   const scollbarLocation = ((scrollheight + viewheight) / allheight) * 100;
  //   console.log('스크롤 높이', scrollheight);
  //   console.log('보고있는 화면 높이', viewheight);
  //   console.log('전체문서 높이', allheight);
  //   console.log('비율:', scollbarLocation + '%');
  //   const homeguide = document.querySelector('.Home-guide2');
  //   const homeButton = document.querySelector('.Home-button');
  //   const homeButton2 = document.querySelector('.Home-button2');
  //   if (scollbarLocation > 80) {
  //     homeguide?.classList.add('Home-guideEffect');
  //     homeButton?.classList.add('Home-ButtonEffect');
  //     homeButton2?.classList.add('Home-ButtonEffect');
  //   }
  //   e.stopPropagation();
  // };

  useEffect(() => {
    HomeImage();

    //해당 타겟이 나오면 CSS 애니메이션 발생
    const options: any = { thresholad: 1.0 };

    const callback = (entries: any, observer: any) => {
      entries.forEach((entry: any) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          const homeguide = document.querySelector('.Home-guide2');
          const homeButton = document.querySelector('.Home-button');
          const homeButton2 = document.querySelector('.Home-button2');
          homeguide?.classList.add('Home-guideEffect');
          homeButton?.classList.add('Home-ButtonEffect');
          homeButton2?.classList.add('Home-ButtonEffect');
          // console.log('CSS 애니메이션 시작');
        } else {
          // console.log('화면에서 보이지 않음');
        }
      });
    };
    const observer = new IntersectionObserver(callback, options);
    const target = document.querySelector('.Home-guide2');
    if (target !== null) {
      observer.observe(target);
    }
  }, []);
  // const options: any = { thresholad: 1.0 };

  // const callback = (entries: any, observer: any) => {
  //   entries.forEach((entry: any) => {
  //     if (entry.isIntersecting) {
  //       observer.unobserve(entry.target);
  //       const homeguide = document.querySelector('.Home-guide2');
  //       const homeButton = document.querySelector('.Home-button');
  //       const homeButton2 = document.querySelector('.Home-button2');
  //       homeguide?.classList.add('Home-guideEffect');
  //       homeButton?.classList.add('Home-ButtonEffect');
  //       homeButton2?.classList.add('Home-ButtonEffect');
  //     } else {
  //       console.log('화면에서 제외됨');
  //     }
  //   });
  // };
  // const observer = new IntersectionObserver(callback, options);
  // const target = document.querySelector('.Home-guide2');
  // if (target !== null) {
  //   observer.observe(target);
  // }
  // 배경화면 랜덤
  // const url = 'http://localhost';
  // const url = 'https://server.memory-road.net';
  const HomeImage = () => {
    const imageArr = [
      `${url}/upload/Andong.jpg`,
      `${url}/upload/streetImage.jpg`,
      `${url}/upload/HomeImage.jpg`,
      `${url}/upload/namsan.jpg`,
      `${url}/upload/city.jpg`,
    ];
    const number = Math.floor(Math.random() * 5);
    // console.log(number);
    const background = document.querySelector('.Home-notgrid');
    background?.setAttribute(
      'style',
      `background-image : url(${imageArr[number]})`,
    );
    // notgrid?.setAttribute('background-image', url(imageArr[number]);
  };
  // useEffect(HomeImage, []);

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
                <br />
                <button
                  className="Home-button3"
                  onClick={() =>
                    // window.scrollTo(0, document.documentElement.scrollHeight)
                    window.scrollTo({
                      top: document.documentElement.scrollHeight,
                      behavior: 'smooth',
                    })
                  }
                >
                  메모리로드 <span>체험</span> 하러 가기
                </button>
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
              // gif로 수정
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
              src="https://server.memory-road.net/upload/map_final.gif"
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
                  navigate('/createRoute');
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
