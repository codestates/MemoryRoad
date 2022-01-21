import React from 'react';
import './clickImage.css';
import { Picture } from '../../types/searchRoutesTypes';

type Props = {
  pickPinsPictures: Picture[] | undefined;
  pictureIdx: number;
  setBigImage: React.Dispatch<React.SetStateAction<boolean>>;
};

function ClickImage({ pickPinsPictures, pictureIdx, setBigImage }: Props) {
  return (
    <>
      <div className="modal">
        <div
          className="modalBox"
          onClick={() => setBigImage(false)}
          onKeyPress={() => setBigImage(false)}
          role="button"
          tabIndex={0}
        >
          {pickPinsPictures ? (
            <img
              alt="이미지 로딩 실패"
              id="click-el-img-img"
              src={`https://server.memory-road.net/${pickPinsPictures[pictureIdx].fileName}`}
            />
          ) : null}
          <p></p>
        </div>
      </div>
    </>
  );
}

export default ClickImage;
