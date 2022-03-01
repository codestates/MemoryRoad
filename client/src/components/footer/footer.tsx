import React from 'react';
import Mist from '../mist/mist';
import './footer.css';
function Footer() {
  return (
    <div>
      <div className="footer-backgroundcolor">
        <footer className="footer-footer">
          <span className="footer-MemoryRoad">
            MeMo<span className="footer-ryRoad">ryRoad</span>
          </span>
          <span className="footer-footerText">
            <span className="footer-name">김동운</span>{' '}
            <span className="footer-name">노학민</span>{' '}
            <span className="footer-name">양재영</span>{' '}
            <span className="footer-name">이승연</span>
          </span>
        </footer>
      </div>
    </div>
  );
}

export default Footer;
