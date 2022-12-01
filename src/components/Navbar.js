import React from "react";
import Logo from "../logos/db_logo.png";

import "../css/Navbar.css";

function Navbar() {
  return (
    <div className="site-navbar">
      <img
        style={{ height: "200%", marginTop: "-40px" }}
        src={Logo}
        alt="hi"
      ></img>
    </div>
  );
}

export default Navbar;
