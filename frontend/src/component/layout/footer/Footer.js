import React from "react";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="Appstore" />
      </div>

      <div className="midFooter">
        <h1>MY ECOMMERCE.</h1>
        <p>Our foremost commitment is to deliver top-notch quality.</p>

        <p>Copyrights 2023 &copy; A@shishJha</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="http://instagram.com/_aashish__jha_48">Instagram</a>
        <a href="http://youtube.com">Youtube</a>
        <a href="http://instagram.com/_aashish__jha_48">Facebook</a>
      </div>
    </footer>
  );
};

export default Footer;