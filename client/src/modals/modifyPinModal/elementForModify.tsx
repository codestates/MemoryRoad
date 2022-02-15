import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ElementForModify = ({
  handleIsModifyModalOpen,
  setIsEmptyInfo,
  currInfoForModify,
  onUpdateItem,
  routeId,
}: any) => {
  const { id, locationName, Pictures } = currInfoForModify;
  const [pinTitle, setPinTitle] = useState(locationName);
  const [pinImages, setPinImages] = useState<any[]>([...Pictures]);
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
    setPinImages(pinImages.concat(...imgArr));
  };
  const deletePinImgFile = (event: any) => {
    // pinImage delete
    // 사진 삭제 이벤트
    if (event.target.id !== '0') {
      const [pictureId, pinId] = event.target.id.split('&');
      axios({
        url: `https://server.memory-road.net/routes/${routeId}/pins/${pinId}/pictures/${pictureId}`,
        method: 'delete',
        withCredentials: true,
      })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            const updatedFiles = pinImages.filter((el) => {
              if (String(el.id) === pictureId) return false;
              else return true;
            });
            setPinImages(updatedFiles);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    const fileName = event.target.title;
    const updatedFiles = pinImages.filter((el) => {
      if (el.name === fileName) return false;
      else return true;
    });
    setPinImages(updatedFiles);
  };
  const handleModifyPin = () => {
    // pinSave
    const deleteTag: any = document.getElementById('modifyPinModal-background');
    deleteTag.remove();
    handleIsModifyModalOpen(false);
    onUpdateItem(String(id), pinTitle, pinImages);
    // onAddItem(pinTitle, pinImages, currMarkerInfo);
  };
  return (
    <div id="modifyPinModal-container">
      <div className="modifyPinModal-title">
        제목 <b className="text-highlight">*</b>
      </div>
      <input
        className="modifyPinModal-input"
        id="modifyPinModal-place-title"
        max-length="13"
        onChange={handleText}
        type="text"
        value={pinTitle}
      />
      <div className="modifyPinModal-title">
        사진 첨부
        <form
          encType="multipart/form-data"
          id="file-upload-form"
          method="post"
          name="chooseImgFilesForm"
          onChange={handlePinImgFiles}
        >
          <div className="modifyPinModal-input addImgFilesBtn">
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
      <div id="modifyPinModal-pictures-background">
        <div id="modifyPinModal-pictures-container">
          {pinImages.map((el, idx) => (
            <div className="modifyPinModal-picture-box" id={el.name} key={idx}>
              <button
                className="modifyPinModal-delete-picture"
                name={el.name}
                onClick={(event) => deletePinImgFile(event)}
                type="button"
              >
                <img
                  alt="closeImage"
                  className="modifyPinModal-close-btn"
                  id={`${el.id}&${el.pinId}` || '0'} // 기존에 있던 사진은 id값을 따로 부여한다.
                  src="https://server.memory-road.net/upload/close_icon.png"
                  title={el.name || el.fileName}
                ></img>
              </button>
              <img
                alt="uploadPicture"
                className="modifyPinModal-picture"
                src={
                  el.name
                    ? URL.createObjectURL(el)
                    : `https://server.memory-road.net/${el.fileName}`
                }
              ></img>
            </div>
          ))}
        </div>
      </div>
      <button
        id="modifyPinModal-save-btn"
        onClick={() => {
          pinTitle.length === 0 ? setIsEmptyInfo(true) : handleModifyPin();
        }}
      >
        수정 완료
      </button>
    </div>
  );
};

export default ElementForModify;
