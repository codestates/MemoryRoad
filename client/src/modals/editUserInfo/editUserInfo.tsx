import React, { useEffect, useState } from 'react';
import Mist from '../../components/mist';
import './editUserInfo.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  editUserInfoModal,
  setUserInfo,
  withdrawalModal,
} from '../../redux/actions/index';
import { RootState } from '../../redux/reducer';
import axios from 'axios';

function EditUserInfo({ isvalid, url }: any) {
  const dispatch = useDispatch();
  const userinfo = useSelector(
    (state: RootState) => state.setUserInfoReducer.userInfo,
  ); // 유저의 정보
  // 회원정보 수정 시 닉네임
  const [username, setUsername] = useState('');
  const InputUsername = (e: any) => {
    setUsername(e.target.value);
  };
  // 회원정보 수정 시 비밀번호
  const [Password, setPassword] = useState('');
  const InputPassword = (e: any) => {
    setPassword(e.target.value);
  };
  // 회원정보 수정 시 비밀번호 확인
  const [checkingPassword, setCheckingPassword] = useState('');
  const InputCheckingPassword = (e: any) => {
    setCheckingPassword(e.target.value);
  };

  const [profile, setprofile] = useState(userinfo.profile); // 바뀐 프로필 사진
  const [nameErrorMessage, setnameErrorMessage] = useState(''); // 닉네임 변경 에러메시지
  const [passwordErrorMessage, setpasswordErrorMessage] = useState(''); // 비밀번호 변경 에러메시지
  const [nameSuccessMessage, setnameSuccessMessage] = useState(''); // 닉네임 변경 성공메시지
  const [passwordSuccessMessage, setpasswordSuccessMessage] = useState('');
  // 프로필 사진을 가져옴
  const readProfile = (image: any) => {
    // readProfile(e.target);
    if (image.files && image.files[0]) {
      // 바뀐 프로필 사진
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const previewImage: any = document.getElementById(
          'edituserinfo-previewImage',
        );
        if (previewImage) {
          previewImage.src = e.target.result;
        }
      };
      setprofile(image.files[0]);
      reader.readAsDataURL(image.files[0]);

      return true;
    } else {
      setprofile(userinfo.profile); // 유저의 원래 프로필
      return false;
    }
  };
  // 프로필 사진을 수정하는 API요청
  const setProfile = () => {
    const getelement: any = document.getElementById('ProfileImg');
    const profileImg = getelement.files[0];
    console.log(profileImg);

    const formData = new FormData(); // 폼데이터 형식으로 보냄
    formData.append('profile', profileImg);
    console.log(formData.get('profile'));
    // blob : 사진을 저장할 때 사용함

    axios
      .patch(`${url}/users/profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setUserInfo(
              true,
              userinfo.id,
              userinfo.email,
              userinfo.username,
              res.data.profile,
              userinfo.OAuthLogin,
            ),
          );
          console.log(userinfo);
        }
      })
      .catch((error) => console.log(error));
  };

  // 닉네임 수정버튼을 누를 때 API 요청
  const editUsername = () => {
    if (isvalid('', username, '')) {
      axios
        .patch(
          `${url}/users/user-name`,
          { userName: username },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          },
        )
        .then((res) => {
          if (res.status === 200) {
            dispatch(
              setUserInfo(
                true,
                userinfo.id,
                userinfo.email,
                username,
                userinfo.profile,
                userinfo.OAuthLogin,
              ),
            );
            console.log(userinfo);
            setnameErrorMessage('');
            setnameSuccessMessage('닉네임이 수정되었습니다.');
          }
        })
        .catch((error) => {
          console.log(error);
          setnameErrorMessage('입력한 정보로 수정할 수  없습니다.');
          setnameSuccessMessage('');
        });
    }
    if (isvalid('', username, '') !== 'Username') {
      setnameErrorMessage('2자 이상 그리고 공백이 들어갈 수 없습니다.');
      setnameSuccessMessage('');
    }
    // else {
    //   setnameErrorMessage('입력한 정보로 수정할 수 없습니다.');
    //   setnameSuccessMessage('');
    // }
  };
  // 비밀번호 변경버튼을 누를 때 API 요청
  const editPassword = () => {
    if (isvalid('', '', Password) && Password === checkingPassword) {
      axios
        .patch(
          `${url}/users/password`,
          { password: Password },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          },
        )
        .then((res) => {
          if (res.status === 200) {
            setpasswordErrorMessage('');
            setpasswordSuccessMessage('비밀번호가 변경되었습니다.');
          }
        });
    }
    if (!isvalid('', '', Password)) {
      setpasswordErrorMessage('8~16자의 영문,숫자,특수문자를 사용하세요');
      setpasswordSuccessMessage('');
    } else if (Password !== checkingPassword) {
      setpasswordErrorMessage('비밀번호가 일치하지 않습니다.');
      setpasswordSuccessMessage('');
    }
  };
  return (
    <div
      className="edituserinfo-mist"
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        dispatch(editUserInfoModal(false));
      }}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        dispatch(editUserInfoModal(false));
      }}
      role="menu"
      tabIndex={0}
    >
      <div className="edituserinfo-EditBorder ">
        <div className="edituserinfo-center edituserinfo-titleEdituserinfo ">
          회원정보 수정
        </div>
        <div className="edituserinfo-EditBorder2 edituserinfo-CreateScrollBar ">
          <div className="edituserinfo-textOninput ">
            프로필
            <div className="edituserinfo-gridProfile">
              {userinfo.profile ? (
                <img
                  alt="previewimg"
                  id="edituserinfo-previewImage"
                  src={`${url}/${userinfo.profile}`}
                />
              ) : (
                <i className="fas fa-user-circle edituserinfo-EditProfile"></i>
              )}

              <form
                // action="./url.js" //form데이터를 전송할 경로
                className="edituserinfo-form"
                encType="multipart/form-data"
                id="submitImage"
                method="post"
              >
                <label className="edituserinfo-EditProfileButton edituserinfo-EditButtonColor">
                  <input
                    accept="image/*"
                    id="ProfileImg"
                    name="ProfileImage"
                    onChange={(e) => {
                      readProfile(e.target);
                      setProfile();
                    }} // 프로필 이미지 수정
                    style={{ display: 'none' }}
                    type="file"
                  />
                  프로필 수정
                </label>
              </form>
            </div>
          </div>
          <div className="edituserinfo-textOninput">닉네임</div>
          <input
            className="edituserinfo-input2"
            maxLength={10}
            onChange={InputUsername}
            placeholder={userinfo.username}
            type="text"
          ></input>
          <div
            className="edituserinfo-ErrorMessage2"
            style={{ marginBottom: '30px' }}
          >
            {nameErrorMessage}
            <div className="edituserinfo-successMessage">
              {nameSuccessMessage}
            </div>
            <div id="edituserinfo-EditProfileButtonRight">
              <button
                className="edituserinfo-EditNickname edituserinfo-EditButtonColor"
                onClick={editUsername}
              >
                닉네임 수정
              </button>
            </div>
          </div>
          {userinfo.OAuthLogin ? null : (
            <div>
              <div className="edituserinfo-textOninput">비밀번호</div>
              <input
                className="edituserinfo-input2"
                maxLength={16}
                onChange={InputPassword}
                placeholder="비밀번호를 입력해주세요."
                type="password"
              ></input>
              <div className="edituserinfo-ErrorMessage2">
                {passwordErrorMessage}
              </div>
              <input
                className="edituserinfo-input2"
                maxLength={16}
                onChange={InputCheckingPassword}
                placeholder="비밀번호을 다시 한번 입력해주세요."
                type="password"
              ></input>
              <div
                className="edituserinfo-ErrorMessage2"
                style={{ marginBottom: '15px' }}
              >
                <div className="edituserinfo-successMessage">
                  {passwordSuccessMessage}
                </div>
              </div>
              <div id="edituserinfo-EditProfileButtonRight">
                <button
                  className="edituserinfo-EditNickname edituserinfo-EditButtonColor"
                  onClick={editPassword}
                >
                  비밀번호 수정
                </button>
              </div>
            </div>
          )}

          <div className="edituserinfo-textOninput">회원 탈퇴</div>
          <div id="edituserinfo-EditProfileButtonRight">
            <button
              className="edituserinfo-EditNickname edituserinfo-withdrawalButton"
              onClick={() => {
                dispatch(editUserInfoModal(false));
                dispatch(withdrawalModal(true));
              }}
            >
              회원탈퇴
            </button>
          </div>
        </div>
        <div className="edituserinfo-center">
          <button
            className="edituserinfo-edituserinfoButton userModalPointer"
            onClick={() => dispatch(editUserInfoModal(false))}
          >
            회원정보 수정완료
          </button>
          <div className="Font_MemoryRoad editUserInfo-MemoryRoad">
            MeMoryRoad
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditUserInfo;
