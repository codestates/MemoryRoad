export interface Picture {
  id: number;
  pinId: number;
  fileName: string;
}

export interface Pin {
  id: number;
  routesId: number;
  ranking: number;
  locationName: string;
  lotAddress: string;
  roadAddress: string;
  ward: string;
  tooClose: boolean;
  startTime: number;
  endTime: number;
  latitude: string;
  longitude: string;
  Pictures: Picture[];
}

export interface Route {
  id: number;
  routeName: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  public: boolean;
  color: string;
  time: number;
  Pins: Pin[];
  thumbnail: string;
}

export interface Route1 {
  id: number;
  routeName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  public: boolean;
  color: string;
  time: number;
  Pins: Pin[];
  thumbnail: string;
}