import './createPinModal.css';

const createPinModal: string =
  "  <div id='createPinModal-background'>" +
  "    <div id='createPinModal-container'>" +
  "      <div class='createPinModal-title'>" +
  "        제목 <b class='text-highlight'>*</b>" +
  '      </div>' +
  "      <input class='createPinModal-input' id='createPinModal-place-title' type='text' placeholder='장소의 제목을 입력해주세요' maxlength='10'>" +
  "      <div class='createPinModal-title'>" +
  '        사진 첨부' +
  '      </div>' +
  "      <form name='chooseImgFilesForm' id='file-upload-form' method='post' enctype='multipart/form-data'>" +
  "        <div class='createPinModal-input addImgFilesBtn'>" +
  "          <label for='file-upload' id='file-upload-image'>" +
  "            <img src='http://127.0.0.1:5500/client/public/img/addPhoto_icon.png' width='40'>" +
  '          </label>' +
  '        </div>' +
  "        <input class='display-none' id='file-upload' type='file' accept='image/*' multiple/>" +
  '      </form>' +
  "      <div id='createPinModal-pictures-background'>" +
  "        <div id='createPinModal-pictures-container'>" +
  '          <!--이미지 태그들 생성될 자리-->' +
  '        </div>' +
  '      </div>' +
  "      <button id='createPinModal-save-btn'>장소 저장</button>" +
  '    </div>' +
  '  </div>';

export default createPinModal;
