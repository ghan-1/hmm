import React from "react";
import "../css/Footer.css";
import Logo from "../logos/educative.png";

function Footer() {
  return (
    <div className="site-footer">
      <h6>
        Created By:
        <img
          style={{ height: "30px", paddingRight: "20px" }}
          src={Logo}
          alt="Educative"
        ></img>
      </h6>
    </div>
  );
}

export default Footer;
