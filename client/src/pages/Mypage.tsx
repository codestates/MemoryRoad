import React from "react";
import "./Mypage.css";

function Mypage() {
  return (
    <div>
      <div className="gridMypage">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div className="checking">
          <i className="fas fa-user-circle Profile"></i>
        </div>
        <div className="checking">
          <div className="greeting">
            <div>[닉네임]님, 안녕하세요! </div>
            <button className="changeUserInfo">
              회원정보 수정 <i className="fas fa-user"></i>
            </button>
          </div>
        </div>
        <div></div>
        <div></div>
        <div className="checking map">
          <hr></hr>
          <div>map</div>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default Mypage;
