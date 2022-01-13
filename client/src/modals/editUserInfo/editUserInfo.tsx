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
  const [showProfile, setShowProfile] = useState(false); // 프로필사진을 가져오면 true로 바뀐다
  const [profile, setprofile] = useState(userinfo.profile); // 바뀐 프로필 사진
  // 프로필 사진을 가져옴
  const readProfile = (image: any) => {
    // readProfile(e.target);

    if (image.files && image.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const previewImage: any = document.getElementById(
          'edituserinfo-previewImage',
        );
        previewImage.src = e.target.result;
      };
      setprofile(image.files[0].name);
      // console.log(image.files[0].name);
      reader.readAsDataURL(image.files[0]);
      return true;
    } else {
      setprofile(userinfo.profile);
      return false;
    }
  };
  // 프로필 사진을 수정하는 API요청
  useEffect(() => {
    console.log(profile);
    axios.patch(`${url}/users/profile`, { profile: profile }).then((res) => {
      if (res.status === 200) {
        dispatch(
          setUserInfo(
            true,
            userinfo.id,
            userinfo.email,
            userinfo.username,
            profile,
            userinfo.OAuthLogin,
          ),
        );
      }
    });
  }, [profile]);

  // 닉네임 수정버튼을 누를 때 API 요청
  const editUsername = () => {
    if (isvalid('', username, '')) {
      axios
        .patch(`${url}/users/user-name`, { userName: username })
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
          }
        });
    } else {
      alert('입력한 정보로 수정할 수 없습니다.');
    }
  };
  // 비밀번호 변경버튼을 누를 때 API 요청
  const editPassword = () => {
    if (isvalid('', '', Password) && Password === checkingPassword) {
      axios
        .patch(`${url}/users/password`, { password: Password })
        .then((res) => {
          if (res.status === 200) {
            alert('비밀번호가 변경되었습니다.');
          }
        });
    }
    if (!isvalid('', '', Password)) {
      alert('입력하신 정보로 수정할 수 없습니다.');
    } else if (Password !== checkingPassword) {
      alert('비밀번호를 다시 확인해주세요');
    }
  };
  return (
    <div>
      <Mist />
      <div className="edituserinfo-EditBorder ">
        <div className="edituserinfo-center edituserinfo-titleEdituserinfo ">
          회원정보 수정
        </div>
        <div className="edituserinfo-EditBorder2 edituserinfo-CreateScrollBar ">
          <div className="edituserinfo-textOninput ">
            프로필
            <div className="edituserinfo-gridProfile">
              {showProfile ? (
                <img alt="previewimg" id="edituserinfo-previewImage" />
              ) : (
                <i className="fas fa-user-circle edituserinfo-EditProfile"></i>
              )}
              {/* 프로필 사진 */}
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
                      if (readProfile(e.target)) {
                        setShowProfile(true);
                      } else {
                        setShowProfile(false);
                      }
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
            {isvalid('', username, '') === 'Username'
              ? null
              : '공백이 들어갈 수 없고 2자이상이어야 합니다'}
            <div id="edituserinfo-EditProfileButtonRight">
              <button
                className="edituserinfo-EditNickname edituserinfo-EditButtonColor"
                onClick={editUsername}
              >
                닉네임 수정
              </button>
            </div>
          </div>

          <div className="edituserinfo-textOninput">비밀번호</div>
          <input
            className="edituserinfo-input2"
            maxLength={16}
            onChange={InputPassword}
            placeholder="비밀번호를 입력해주세요."
            type="password"
          ></input>
          <div className="edituserinfo-ErrorMessage2">
            {isvalid('', '', Password) === 'Password'
              ? null
              : '8~16자의 영문,숫자,특수문자를 사용하세요'}
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
            {Password === checkingPassword
              ? null
              : '비밀번호가 일치하지 않습니다.'}
          </div>
          <div id="edituserinfo-EditProfileButtonRight">
            <button
              className="edituserinfo-EditNickname edituserinfo-EditButtonColor"
              onClick={editPassword}
            >
              비밀번호 수정
            </button>
          </div>
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
          <div className="Font_MemoryRoad">MeMoryRoad</div>
        </div>
      </div>
    </div>
  );
}

export default EditUserInfo;
