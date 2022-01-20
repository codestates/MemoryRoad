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
interface UPTPin {
  id: number | null | undefined; // number
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
interface UPTFile {
  id: number | null | undefined; // number
  ranking: number | null | undefined;
  images: any;
  Pictures: any;
}
// 핀의 id,위도+경도 저장 형식
interface Position {
  pinID: string | null | undefined;
  locationName: string | null | undefined;
  latlng: any;
}
interface UPTPosition {
  id: number | null | undefined; // number
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
  mapPinPosition: Array<Position> | null | undefined; // 핀 순서 변경 배열
  /* 핀 수정창 */
  modifiedPins: Array<UPTPin> | null | undefined;
  modifiedFiles: Array<UPTFile> | null | undefined;
  modifiedPinPosition: Array<UPTPosition> | null | undefined;
  modifiedMapPinPosition: Array<UPTPosition> | null | undefined;
  /* color관련 상태 불변 */
  colorDotUrl: Array<string>;
  colorChip: Array<string>;
  colorName: Array<string>;
  wards: Array<string>;
};

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
  mapPinPosition: [
    {
      pinID: null,
      locationName: null,
      latlng: null,
    },
  ],
  // route는 route 수정완료 모달창에서 바로 axios 요청보내면되고.
  // pin들은 따로 상태를 저장해서 관리해야한다.
  modifiedPins: [
    {
      id: null,
      ranking: null,
      locationName: null,
      latitude: null,
      longitude: null,
      lotAddress: null,
      roadAddress: null,
      ward: null,
      startTime: null,
      endTime: null,
    },
  ],
  modifiedFiles: [
    {
      id: null,
      ranking: null,
      images: null, // 새로 업로드된 사진
      Pictures: null, // 기존에 있던 사진
    },
  ],
  modifiedPinPosition: [
    {
      id: null,
      locationName: null,
      latlng: null,
    },
  ],
  modifiedMapPinPosition: [
    {
      id: null,
      locationName: null,
      latlng: null,
    },
  ],
  colorDotUrl: [
    'https://server.memory-road.net/upload/red_dot.png',
    'https://server.memory-road.net/upload/orange_dot.png',
    'https://server.memory-road.net/upload/yellow_dot.png',
    'https://server.memory-road.net/upload/yellowGreen_dot.png',
    'https://server.memory-road.net/upload/green_dot.png',
    'https://server.memory-road.net/upload/sky_dot.png',
    'https://server.memory-road.net/upload/blue_dot.png',
    'https://server.memory-road.net/upload/purple_dot.png',
    'https://server.memory-road.net/upload/pink_dot.png',
  ],
  colorChip: [
    '#DC4B40' /* red */,
    '#EE8343' /* orange */,
    '#F8F862' /* yellow */,
    '#ADE672' /* yellowGreen */,
    '#8DAF69' /* green */,
    '#91C1C7' /* sky */,
    '#6B91E3' /* blue */,
    '#9E7FCB' /* purple */,
    '#EE9FE5' /* pink */,
  ],
  colorName: [
    'red',
    'orange',
    'yellow',
    'yellowGreen',
    'green',
    'sky',
    'blue',
    'purple',
    'pink',
  ],
  wards: [
    '전체 구',
    '강남구',
    '강동구',
    '강북구',
    '강서구',
    '관악구',
    '광진구',
    '구로구',
    '금천구',
    '노원구',
    '도봉구',
    '동대문구',
    '동작구',
    '마포구',
    '서대문구',
    '서초구',
    '성동구',
    '성북구',
    '송파구',
    '양천구',
    '영등포구',
    '용산구',
    '은평구',
    '종로구',
    '중구',
    '중랑구',
  ],
};

export default initialState;
