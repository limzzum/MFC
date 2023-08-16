import React from "react";
import { Link } from "react-router-dom";
import logoImage from "../../../images/logo.png";
// import settingIcon from "../../../images/setting.png";
// import exitIcon from "../../../images/exitIcon.png";
import style from "../debatePage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faGear,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

function Header({
  status,
  leaveSession,
  handleModifyModalOpen,
  handleOutRoom,
}) {
  return (
    <header className={style.header}>
      <img className={style.logo} src={logoImage} alt="logo" />
      <div>
        <ul>
          {/* {status === "waiting" && (
            <li>
              <button onClick={handleModifyModalOpen}>
                <FontAwesomeIcon
                  className={style.setting}
                  icon={faGear}
                  color="#2F425DFF"
                  size="2x"
                />
              </button>
            </li>
          )} */}
          <li>
            <Link to={"/"}>
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                color="#2F425DFF"
                size="2x"
                onClick={() => {
                  leaveSession();
                  handleOutRoom();
                }}
                className={style.exit}
              />
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
