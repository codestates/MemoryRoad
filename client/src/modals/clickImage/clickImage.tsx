import React from 'react';
import './clickImage.css';
import { Picture } from '../../types/searchRoutesTypes';

type Props = {
  pickPinsPictures: Picture[] | undefined;
  pictureIdx: number;
  setBigImage: React.Dispatch<React.SetStateAction<boolean>>;
  setPictureIdx: React.Dispatch<React.SetStateAction<number>>;
};

function ClickImage({
  pickPinsPictures,
  pictureIdx,
  setBigImage,
  setPictureIdx,
}: Props) {
  return (
    <>
      <div
        className="clickImage-modal"
        onClick={(e) => {
          if (e.target !== e.currentTarget) {
            return;
          }
          setBigImage(false);
        }}
        onKeyPress={() => setBigImage(false)}
        role="button"
        tabIndex={0}
      >
        <div className="clickImage-modalBox">
          <div className="clickImage-buttonPicture">
            <button
              className="clickImage-button"
              onClick={() => {
                if (pickPinsPictures !== undefined) {
                  if (pictureIdx === 0) {
                    return;
                  }
                }
                setPictureIdx(pictureIdx - 1);
              }}
              type="button"
            >
              <img
                alt="버튼이 고장남"
                className="clickImage-image"
                src="https://server.memory-road.net/upload/prev_button.png"
              />
            </button>
            {pickPinsPictures ? (
              <img
                alt="이미지 로딩 실패"
                id="clickImage-el-img-img"
                src={`https://server.memory-road.net/${pickPinsPictures[pictureIdx].fileName}`}
              />
            ) : null}
            <button
              className="clickImage-button"
              onClick={() => {
                if (pickPinsPictures !== undefined) {
                  if (pictureIdx === pickPinsPictures.length - 1) {
                    return;
                  }
                }
                setPictureIdx(pictureIdx + 1);
              }}
              type="button"
            >
              <img
                alt="버튼이 고장남"
                className="clickImage-image"
                src="https://server.memory-road.net/upload/next_button.png"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClickImage;
