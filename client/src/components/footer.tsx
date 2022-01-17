import React from 'react';
import Mist from './mist';
import './footer.css';
function Footer() {
  return (
    <div>
      <div className="footer-backgroundcolor">
        <footer className="footer-footer">
          <img
            alt="footerLogo"
            src="http://127.0.0.1:5500/client/public/img/MeMoryRoadLogo.png"
          />
          <span className="footer-footerText">김동운 노학민 양재영 이승연</span>
        </footer>
      </div>
    </div>
  );
}

export default Footer;
