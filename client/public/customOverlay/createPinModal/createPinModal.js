let imageList = [];
function loadFile(input) {
  // console.log(input);
  const fileList = input.files;
  const container = document.getElementById(
    'createPinModal-pictures-container',
  );
  console.log(container);
  for (let i = 0; i < fileList.length; i++) {
    if (imageList.indexOf(fileList[i].name) === -1) {
      imageList.push(fileList[i].name);
      const box = document.createElement('div');
      box.setAttribute('class', 'createPinModal-picture-box');
      box.setAttribute('id', ''.concat(fileList[i].name));
      container.appendChild(box);
      // const test = document.querySelector('createPinModal-picture-box');
      // console.log(test); // null 값이 뜸 ..
      const btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      btn.setAttribute('id', 'createPinModal-delete-picture');
      btn.setAttribute('onclick', 'deleteFile(event)');
      const closeBtn = document.createElement('img');
      closeBtn.setAttribute('class', 'createPinModal-close-btn');
      closeBtn.setAttribute(
        'src',
        'http://127.0.0.1:5500/client/public/img/close_icon.png',
      );
      closeBtn.setAttribute('name', ''.concat(fileList[i].name));
      btn.appendChild(closeBtn);
      box.appendChild(btn);
      const newImg = document.createElement('img');
      newImg.setAttribute('class', 'createPinModal-picture');
      newImg.setAttribute('src', URL.createObjectURL(fileList[i]));
      box.appendChild(newImg);
    }
  }
}
// useEffect 가 맨처음에만 실행되고 그 이후엔 실행되지 않아서
// EventHandler 자체는 등록이 되어있는데 그리고서는 실행되지 않았다 .. -> 이거 공부해봐야 한다 ..
function deleteFile(event) {
  const fileName = event.target.name;
  const idx = imageList.indexOf(fileName);
  const deleteTag = document.getElementById(fileName);
  imageList.splice(idx, 1);
  deleteTag.remove();
  console.log(imageList);
}

function closeModal() {
  const deleteTag = document.getElementById('createPinModal-background');
  deleteTag.remove();
  if (imageList.length !== 0) {
    imageList = [];
  }
}

// export문은 HTML 안에 작성한 스크립트에서는 사용할 수 없습니다.
