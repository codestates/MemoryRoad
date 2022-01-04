import { Pin } from './interface/pin.interface';
import haversine from 'haversine-distance';
import { PinEntity } from './entities/pin.entity';

//핀들의 배열을 받아 서로 근접한 경우 tooClose프로퍼티를 true로 설정한다.
export function isClosewithOther(pins: Pin[]): void {
  for (let i = 0; i < pins.length; i++) {
    for (let j = i + 1; j < pins.length; j++) {
      const iLoc = { lat: pins[i].latitude, lng: pins[i].longitude };
      const jLoc = { lat: pins[j].latitude, lng: pins[j].longitude };

      //두 점의 거리를 미터 단위로 계산
      //100미터 이내일 경우 가깝다고 판단
      if (haversine(iLoc, jLoc) <= 100) {
        pins[i]['tooClose'] = true;
        pins[j]['tooClose'] = true;
      }
    }
  }
}

// DB에 저장된 핀들과 저장하려고 하는 핀을 비교해, 서로 근접한 경우 tooClose프로퍼티를 true로 설정한다.
// 반환하는 객체로 DB에 업데이트할 핀들을 알 수 있다.
export function isClosewithDB(
  dbPins: PinEntity[],
  pin: Pin,
): { id: number; tooClose: boolean }[] {
  const pinLoc = { lat: pin.latitude, lng: pin.longitude };

  //업데이트 대상 핀들의 정보를 담기 위한 배열
  const dbPinId: { id: number; tooClose: boolean }[] = [];
  for (let i = 0; i < dbPins.length; i++) {
    const dbLoc = { lat: dbPins[i].latitude, lng: dbPins[i].longitude };
    //두 점의 거리를 미터 단위로 계산
    //100미터 이내일 경우 가깝다고 판단
    if (haversine(pinLoc, dbLoc) <= 100) {
      pin['tooClose'] = true;
      if (!dbPins[i].tooClose) {
        dbPinId.push({ id: dbPins[i].id, tooClose: true });
      }
    }
  }

  return dbPinId;
}
