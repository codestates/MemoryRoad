import React, { useState } from 'react';

const ElementForModify = ({
  handleIsModifyModalOpen,
  setIsEmptyInfo,
  currInfoForModify,
  currFileForModify,
  selectCurrModifedID,
  onUpdateItem,
}: any) => {
  const { pinID, locationName } = currInfoForModify;
  const files = !currFileForModify ? [] : currFileForModify.files;
  const [pinTitle, setPinTitle] = useState(locationName);
  const [pinImages, setPinImages] = useState<any[]>(files);
  const handleText = (event: any, maxLength: number) => {
    // pin Title
    setPinTitle(event.target.value.substr(0, maxLength));
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
    // 사진 삭제
    const fileName = event.target.title;
    console.log(fileName);
    const updatedFiles = pinImages.filter((el) => {
      if (el.name === fileName) return false;
      else return true;
    });
    setPinImages(updatedFiles);
  };
  const handleModifyPin = () => {
    // pinSave
    console.log('저장 버튼을 눌렀습니다. 창을 닫습니다');
    const deleteTag: any = document.getElementById('modifyPinModal-background');
    deleteTag.remove();
    handleIsModifyModalOpen();
    onUpdateItem(pinID, pinTitle, pinImages);
  };
  return (
    <div id="modifyPinModal-container">
      <div className="modifyPinModal-title">
        제목 <b className="text-highlight">*</b>
      </div>
      <input
        className="modifyPinModal-input"
        id="modifyPinModal-place-title"
        onChange={(event) => handleText(event, 13)}
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
          {pinImages.map((el: any, idx: any) => (
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
                  src="https://server.memory-road.net/upload/close_icon.png"
                  title={el.name}
                ></img>
              </button>
              <img
                alt="uploadPicture"
                className="modifyPinModal-picture"
                src={URL.createObjectURL(el)}
              ></img>
            </div>
          ))}
        </div>
      </div>
      <button
        id="modifyPinModal-save-btn"
        onClick={() => {
          pinTitle.length === 0 ? setIsEmptyInfo(true) : handleModifyPin();
          selectCurrModifedID('');
        }}
      >
        수정 완료
      </button>
    </div>
  );
};

export default ElementForModify;
