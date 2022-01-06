import React from 'react';
import Mist from '../../components/mist';
import './editUserInfo.css';
import { useDispatch } from 'react-redux';
function EditUserInfo() {
  const dispatch = useDispatch();
  return (
    <div>
      <Mist />
      <div className="EditBorder ">
        <div className="center titleLogin ">회원정보 수정</div>
        <div className="EditBorder2 CreateScrollBar ">
          <div className="textOninput ">
            프로필
            <div className="gridProfile">
              <i className="fas fa-user-circle EditProfile"></i>
              <div>
                <form encType="multipart/form-data" method="post">
                  <label className="EditProfileButton EditButtonColor">
                    <input
                      accept="image/*"
                      id="ProfileImg"
                      name="ProfileImage"
                      style={{ display: 'none' }}
                      type="file"
                    />
                    프로필 수정
                  </label>
                </form>
              </div>
            </div>
          </div>
          <div className="textOninput">닉네임</div>
          <input
            className="input2"
            placeholder="닉네임을 입력해주세요."
            type="text"
          ></input>
          <div className="ErrorMessage2" style={{ marginBottom: '30px' }}>
            에러 메시지
            <div id="EditProfileButtonRight">
              <button className="EditNickname EditButtonColor">
                닉네임 수정
              </button>
            </div>
          </div>

          <div className="textOninput">비밀번호</div>
          <input
            className="input2"
            placeholder="비밀번호를 입력해주세요."
            type="password"
          ></input>
          <div className="ErrorMessage2">에러 메시지</div>
          <input
            className="input2"
            placeholder="비밀번호을 다시 한번 입력해주세요."
            type="password"
          ></input>
          <div className="ErrorMessage2" style={{ marginBottom: '15px' }}>
            에러 메시지
          </div>
          <div id="EditProfileButtonRight">
            <button className="EditNickname EditButtonColor">
              비밀번호 수정
            </button>
          </div>
          <div className="textOninput">회원 탈퇴</div>
          <div id="EditProfileButtonRight">
            <button
              className="EditNickname withdrawalButton"
              onClick={() => {
                dispatch({ type: 'closeEditUserInfoModal' });
                dispatch({ type: 'openWithdrawalModal' });
              }}
            >
              회원탈퇴
            </button>
          </div>
        </div>
        <div className="titleLogin">
          <button
            className="SignUpButton pointer"
            onClick={() => dispatch({ type: 'closeEditUserInfoModal' })}
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
