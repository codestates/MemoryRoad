import { diskStorage } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const multerOptions = {
  fileFilter: (req, file, cb) => {
    //파일 확장자 검사
    //확장자가 jpg, jpeg, png가 아니면 TypeError를 throw한다.
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      cb(null, true);
    } else {
      cb(new TypeError('bad img type'), false);
    }
  },
  storage: diskStorage({
    //파일의 저장경로 설정
    destination: function (req, file, cb) {
      cb(null, './upload');
    },
    filename: function (req, file, cb) {
      //랜덤한 이름(범용 고유식별자(uuid) v4. 총 36문자)에 확장자를 추가해서 파일 이름을 짓는다.
      cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
    },
  }),
};
