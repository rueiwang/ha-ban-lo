import React from 'react';
import '../../css/common.css';

const Footer = () => (
  <footer>
    <div className="footer-container">
      <div className="copyright">
        <p>&copy; 2020 hā-pan | Ruei-Tian Wang</p>
        {' '}
        <a href="mailto:want2813@gmail.com&subject=About hā-pan" target="_blank" rel="noopener noreferrer">
          <img src="./imgs/email.png" alt="" />
        </a>
        <a href="https://github.com/Ruei-Tian" target="_blank" rel="noopener noreferrer">
          <img src="./imgs/github.png" alt="" />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
