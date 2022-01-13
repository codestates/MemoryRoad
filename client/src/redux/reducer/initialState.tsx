// 루트 저장 형식
interface Route {
  routeName: string | null | undefined;
  description: string | null | undefined;
  public: boolean | null | undefined;
  color: string | null | undefined;
  time: number | null | undefined;
}
// 핀 저장 형식
interface Pin {
  pinID: string | null | undefined; // 예시) pin1
  ranking: number | null | undefined;
  locationName: string | null | undefined;
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  lotAddress: string | null | undefined;
  roadAddress: string | null | undefined;
  ward: string | null | undefined;
  startTime: string | null | undefined;
  endTime: string | null | undefined;
}
// 사진 저장 형식
interface File {
  pinID: string | null | undefined;
  ranking: number | null | undefined;
  images: any;
}
// 핀의 id,위도+경도 저장 형식
interface Position {
  pinID: string | null | undefined;
  locationName: string | null | undefined;
  latlng: any;
}

interface UserInfo {
  isLogin: boolean; // 로그인 상태
  id: number | null; // 유저의 id값
  email: string | null; // 유저의 email
  username: string | null; // 유저의 닉네임
  profile: string | null; // 유저의 프로필
  OAuthLogin: string | null; // 유저의 소셜로그인 상태
}

export type State = {
  // 학민
  isLoginModal: boolean | null | undefined;
  isSigninModal: boolean | null | undefined;
  isCheckingPasswordModal: boolean | null | undefined;
  isEditUserInfoModal: boolean | null | undefined;
  iswithdrawalModal: boolean | null | undefined;
  userInfo: UserInfo;
  // 승연
  route: Route;
  pins: Array<Pin> | null | undefined;
  files: Array<File> | null | undefined;
  pinPosition: Array<Position> | null | undefined; // 핀 순서 추적 배열
};

/* 생성된 핀을 저장하는 버튼이 있을거고, 이미 있던 핀을 수정하는 버튼이 있을거다. -> 수정버튼이 들어있는 모달창은 얼른 만들어줍시다. */
/*    저장 버튼이 눌리면 의심의 여지 없이 pinPosition의 길이를 확인하고 pinID를 부여하는 것이 맞지만, -> 저장 reducer */
/*    수정 버튼이 눌러면 pins 배열에서 주어진 pinID를 가진 객체를 일단 찾는 작업을 해야할겁니다.      -> 수정 reducer */

// 여기서 any를 부여해주니까 문제생기지 않는다 ... persist 때문에 여기에있는 상태로만은 부족한가봄.
const initialState: State | any = {
  // 학민
  isLoginModal: false,
  isSigninModal: false,
  isCheckingPasswordModal: false,
  isEditUserInfoModal: false,
  iswithdrawalModal: false,
  userInfo: {
    isLogin: false,
    id: null,
    email: null,
    username: null,
    profile: null,
    OAuthLogin: null,
  },
  // 승연
  route: {
    routeName: null, // 루트 제목
    description: null, // 루트 설명
    public: null, // 루트 공개/비공개 여부
    color: null, // 루트 색상
    time: null, // 루트 총 시간
  },
  pins: [
    {
      /* 핀 저장버튼 누르는 동시에 pinID 생성 */
      // (pinPosition의 길이가 0일땐 pin1 부여하고, 0이 아닐 땐 pinPosition의 길이에 1을 더하여 pin을 생성해주자.)
      // (ranking은 pinID의 맨 마지막 수를 따라가면 돼.)
      // (locationName은 상태에 저장된 값을 그냥 가져오기. -> 파란마커와 회색마커 둘 다 반영되어있습니다. 어짜피 브라우저에 뜨는 input창은 하나입니다.)
      // (latitude, longitude, lotAddress, roadAddress, ward -> 파란마커와 회색마커 모두 상태 반영되어있습니다. 어짜피 브라우저에 뜨는 input창은 하나입니다.)

      /* 핀 삭제버튼 누르는 동시에 pinID 검사 -> 사이드바에 있는 핀 카드에 있는 삭제버튼을 클릭했을 때 벌어지는 일 */
      // 해당 핀을 삭제할거냐는 모달창이 뜨는 게 국룰이긴한데 일단은 보류
      // (action의 인자: pinID -> reducer에서 pin배열에서 pinID가 일치하는 객체를 찾아 지워준다. files배열에서 pinID가 일치하는 객체를 찾아 사진도 삭제해준다.)

      /* 핀 수정버튼 누르는 동시에 pinID 검사 -> 사이드바에 있는 핀 카드에 있는 수정버튼을 클릭했을 때 벌어지는 일*/
      // 닫힌 핀을 열어줘야한다. -> 일단 createPinModal을 modifyPinModal.tsx 를 하나 더 생성해라
      // (modifyPinModal은 createPinModal과 반대로 역으로 데이터를 넣어주는 작업이 필요하다.)
      // (useSelector로 불러온 route state에서 현재 클릭한 핀 카드의 pinID 와 일치하는 객체를 찾아 HTML에 예쁘게 넣어주는 작업이 필요하다 :) 헤헤)
      // (pins에서 가져올 수 있는 작업들이 있고 files에서 가져올 수 있는 작업들이 또 있다. -> 핀 카드가 가지고 있는 pinID와 일치하는 pin 정보와 files 정보를 받아와 렌더링 예쁘게 해서 띄워주자)
      // (여기서 이제 핀 저장버튼 대신 수정완료 버튼이 들어간다. 창 닫기 버튼은 삭제삭제 ok)

      //* - 핀 locationName, 핀 files 수정 reducer (핀 장소제목, 사진변경) -> 수정모달창에서 수정 완료 버튼을 눌렀을 때 !
      // (action의 인자: pinID와 locationName, 변경된 이미지파일 배열(핀 생성모달창에서 썼던 observer 재활용하세여)
      // -> reducer에서 pins배열에서 pinID가 일치하는 객체를 찾아 locationName를 업데이트 시켜주고 files배열에서 pinID가 일치하는 객체를 찾아 변경된 이미지 파일로 아예 switch 해준다.)

      //* - 핀 startTime, endTime 수정 reducer (핀 시간변경)
      // (action의 인자: pinID와 startTime, endTime -> reducer에서 pins배열에서 pinID가 일치하는 객체를 찾아 startTime과 endTime을 업데이트 시켜준다)
      // - 핀 ranking 수정 reducer (핀 순서변경)
      // (HTML내의 div태그의 변경을 감지하여:observer => pinID가 들어있는 pinPosition 배열을 업데이트시켜줘야합니다)
      // 예시 : ['zero', 'pin1', 'pin2', 'pin3', 'pin4'] => ['zero', 'pin4', 'pin2', 'pin1', 'pin3'] -> 사용자 입장에서는 박스의 이동을 진짜 마음대로 할 수 있으니까 변경사항을 잘 감시하고 배열 전체를 인자로 받아야겠다.
      //     :           랭킹1    랭킹2    랭킹3    랭킹4                랭킹1    랭킹2    랭킹3    랭킹4
      // (action의 인자: 업데이트된 배열 -> reducer에서 pins배열에서 pinID가 일치하는 객체의 ranking을 인자로 들어온 배열의 인덱스값으로 업데이트시켜주면되겠다 !!)

      /* 대망의 마지막: 루트 저장 버튼 누르는 동시에 */
      // 서버에 요청보내고
      // redux-persist에 있는 route와 pinPosition 키 값 지우기 ! 깨끗하게 청산 -.-

      pinID: null, // -------------> DB filed에는 없는, 내가 편하게 사용하려고 쓰는 상태 키
      ranking: null, // 핀 순서
      locationName: null, // 핀 제목
      latitude: null, // 핀 위도
      longitude: null, // 핀 경도
      lotAddress: null, // 핀 지번 주소
      roadAddress: null, // 핀 도로명 주소
      ward: null, // 핀 지역'구'
      startTime: null, // 핀 시작 시간
      endTime: null, // 핀 끝나는 시간
    },
  ],
  files: [
    {
      pinID: null, // -------------> DB filed에는 없는, 내가 편하게 사용하려고 쓰는 상태 키
      ranking: null, // 핀 순서
      images: null, // 해당 핀의 이미지
    },
  ],
  pinPosition: [
    {
      pinID: null,
      locationName: null,
      latlng: null,
    },
  ],
};

export default initialState;
