export interface Pin {
  ranking: number;
  locationName: string;
  latitude: number;
  longitude: number;
  address: string;
  tooClose?: boolean; //서버에서 직접 계산해야 한다.
  startTime: string;
  endTime: string;
}
