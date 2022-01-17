import React from 'react';
import './home.css';
import Footer from '../components/footer';
function Home() {
  return (
    <div>
      <div className="Home-Container"></div>
      <div className="Home-Contents">
        <div className="Home-checking"></div>
        <div className="Home-checking"></div>
        <div className="Home-checking"></div>
        <div className="Home-checking"></div>
        <div className="Home-checking">
          <div className="Home-MemoryRoad">MEMORYROAD</div>
        </div>
        <div className="Home-checking"></div>
        <div className="Home-checking"></div>
        <div>
          <div className="Home-checking Home-MemoryRoadBorder">
            <div className="Home-MemoryRoadcontent">
              <div>기억하고 싶은 하루가 있으신가요?</div>
              <br />
              <div>오늘은 뭐하고 놀지 계획 세우기 귀찮으신가요?</div>
              <br />
              <div>옛날 사진을 찾아 갤러리를 헤매고 계신가요?</div>
            </div>
            <br />
            <div className="Home-guide">메모리로드가 도와드릴게요.</div>
          </div>
        </div>
        <div className="Home-checking"></div>
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
              src="http://127.0.0.1:5500/client/public/img/AllRouteMap.jpg"
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
              src="http://127.0.0.1:5500/client/public/img/AllRouteMap.jpg"
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
              src="http://127.0.0.1:5500/client/public/img/AllRouteMap.jpg"
            />
          </div>
        </div>
        <div className="Home-checking"></div>
        <div></div>
        <div className=" Home-lastBorder">
          <div className="Home-MemoryRoadBorder">
            <div className="Home-guide">체험할 준비가 되셨나요?</div>
            <div>
              <button className="Home-button">
                메모리로드 <span>기록</span> 하러 가기
              </button>
            </div>
            <div>
              <button className="Home-button">
                메모리로드 <span>검색</span> 하러 가기
              </button>
            </div>
          </div>
        </div>
        <div></div>
        <div className="Home-checking Home-grid2">
          <Footer />
        </div>
        <div></div>
        <div></div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default Home;
