export interface Pin {
  routesId?: number;
  ranking: number;
  locationName: string;
  latitude: number;
  longitude: number;
  lotAddress: string;
  roadAddress: string;
  ward: string;
  tooClose?: boolean; //서버에서 직접 계산해야 한다.
  startTime: number;
  endTime: number;
}
