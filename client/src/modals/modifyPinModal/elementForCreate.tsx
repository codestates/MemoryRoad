import axios from 'axios';
import React, { useState } from 'react';

const ElementForCreate = ({
  currMarkerInfo,
  handleIsModalOpen,
  onAddItem,
  setIsEmptyInfo,
  routeId,
}: any) => {
  const [pinTitle, setPinTitle] = useState('');
  const [pinImages, setPinImages] = useState<any[]>([]);
  // console.log(pinTitle);
  // console.log(pinImages);
  const handleText = (event: any) => {
    // pin Title
    setPinTitle(event.target.value);
  };
  const handlePinImgFiles = (event: any) => {
    // pinImage
    const fileList = event.target.files;
    const imgArr: any = [];
    for (let i = 0; i < fileList.length; i++) {
      imgArr.push(fileList[i]);
    }
    setPinImages(imgArr);
  };
  const deletePinImgFile = (event: any) => {
    // pinImage delete
    // 사진 삭제 이벤트
    const fileName = event.target.title;
    const updatedFiles = pinImages.filter((el) => {
      if (el.name === fileName) return false;
      else return true;
    });
    setPinImages(updatedFiles);
  };
  const handleSavePin = () => {
    // pinSave
    console.log('저장 버튼을 눌렀습니다. 창을 닫습니다');
    const deleteTag: any = document.getElementById('createPinModal-background');
    deleteTag.remove();
    handleIsModalOpen(false);
    onAddItem(pinTitle, pinImages, currMarkerInfo); // 이건 현재 상태 반영
  };

  const requestForCreate = () => {
    const formData = new FormData();
    formData.append('pin', JSON.stringify({ locationName: pinTitle }));
    pinImages.forEach((el) => {
      formData.append('files', el); // 사진 한장 한장 이렇게 append시키는 게 맞아 ?
    });

    axios({
      url: `https://server.memory-road.net/routes/${routeId}/pins`,
      method: 'post',
      data: formData,
      withCredentials: true,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div id="createPinModal-container">
      <div className="createPinModal-title">
        제목 <b className="text-highlight">*</b>
      </div>
      <input
        className="createPinModal-input"
        id="createPinModal-place-title"
        onChange={handleText}
        placeholder="장소의 제목을 입력해주세요"
        type="text"
      />
      <div className="createPinModal-title">
        사진 첨부
        <form
          encType="multipart/form-data"
          id="file-upload-form"
          method="post"
          name="chooseImgFilesForm"
          onChange={handlePinImgFiles}
        >
          <div className="createPinModal-input addImgFilesBtn">
            <label htmlFor="file-upload" id="file-upload-image">
              <img
                alt="icon"
                src="https://server.memory-road.net/upload/addPhoto_icon.png"
                width="40"
              />
            </label>
          </div>
          <input
            accept="image/*"
            className="display-none"
            id="file-upload"
            multiple
            type="file"
          />
        </form>
      </div>
      <div id="createPinModal-pictures-background">
        <div id="createPinModal-pictures-container">
          {pinImages.map((el, idx) => (
            <div className="createPinModal-picture-box" id={el.name} key={idx}>
              <button
                className="createPinModal-delete-picture"
                name={el.name}
                onClick={(event) => deletePinImgFile(event)}
                type="button"
              >
                <img
                  alt="closeImage"
                  className="createPinModal-close-btn"
                  src="https://server.memory-road.net/upload/close_icon.png"
                  title={el.name}
                ></img>
              </button>
              <img
                alt="uploadPicture"
                className="createPinModal-picture"
                src={URL.createObjectURL(el)}
              ></img>
            </div>
          ))}
        </div>
      </div>
      <button
        id="createPinModal-save-btn"
        onClick={() => {
          pinTitle.length === 0 ? setIsEmptyInfo(true) : handleSavePin();
          requestForCreate();
        }}
      >
        장소 저장
      </button>
    </div>
  );
};

export default ElementForCreate;
