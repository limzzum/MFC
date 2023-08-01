import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./havingItem.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faSprayCan, faCross, faHeartCirclePlus, faUserClock, faVolumeXmark, faHand, faAngleDoubleUp } from "@fortawesome/free-solid-svg-icons";

function HavingItem() {
  return (
    <div>
      <div className={styles.titleBox}>
        <div className={styles.title}>보유중인 아이템</div>
        <div>
        <FontAwesomeIcon icon={faCoins} color="orange"/>
        </div>
        <div className={styles.textCoin}>456 Coin</div>
      </div>
      <div className={styles.emptyBox}>
        <hr />
      </div>
      <div className={styles.flexBox}>
        <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faHeartCirclePlus} size="3x" />
          <div className="pt-4">포션</div>
          <div>145 Coin</div>
        </div>
        <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faUserClock} size="3x" />
          <div className="pt-4">시간연장권</div>
          <div>145 Coin</div>
        </div>
        <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faVolumeXmark} size="3x" />
          <div className="pt-4">음소거</div>
          <div>145 Coin</div>
        </div>
        <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faHand} size="3x" />
          <div className="pt-4">끼어들기</div>
          <div>145 Coin</div>
        </div>
        <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faCross} size="3x" />
          <div className="pt-4">수호천사</div>
          <div>145 Coin</div>
        </div>
        <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faSprayCan} size="3x" />
          <div className="pt-4">스프레이</div>
          <div>145 Coin</div>
        </div>
      </div>
    </div>
  );
}

export default HavingItem;
