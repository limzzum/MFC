import React from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./itemStore.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faSprayCan, faCross, faHeartCirclePlus, faUserClock, faVolumeXmark, faHand, faAngleDoubleUp } from "@fortawesome/free-solid-svg-icons";

function ItemStore() {

  return (
    <div>
      <div className={styles.titleBox}>
        <p>상점</p>
      </div>
      <div className={styles.emptyBox}>
        <hr />
      </div>
      <div className={styles.flexBox}>
        <div className={`${styles.itemBox} mx-auto`}>
        <FontAwesomeIcon icon={faHeartCirclePlus} size="3x" color="red" />
          <div className="pt-4">포션</div>
          <div>
          <FontAwesomeIcon icon={faCoins} color="orange" />
           145</div>
          <Button className="btn btn-primary">구입하기</Button>
        </div>
        <div className={`${styles.itemBox} mx-auto`}>
        <FontAwesomeIcon icon={faUserClock} size="3x" />
          <div className="pt-4">시간연장권</div>
          <div className="my-1">
          <FontAwesomeIcon icon={faCoins} color="orange" />
          145
          </div>
          <Button className="btn btn-primary">구입하기</Button>
        </div>
        <div className={`${styles.itemBox} mx-auto`}>
        <FontAwesomeIcon icon={faVolumeXmark} size="3x" />
          <div className="pt-4">음소거</div>
          <div className="my-1">
          <FontAwesomeIcon icon={faCoins} color="orange" />
          145</div>
          <Button className="btn btn-primary">구입하기</Button>
        </div>
        <div className={`${styles.itemBox} mx-auto`}>
        <FontAwesomeIcon icon={faHand} size="3x" />
          <div className="pt-4">끼어들기</div>
          <div className="my-1">          
          <FontAwesomeIcon icon={faCoins} color="orange" />
          145</div>
          <Button className="btn btn-primary">구입하기</Button>
        </div>
        <div className={`${styles.itemBox} mx-auto`}>
        <FontAwesomeIcon icon={faCross} size="3x" />
          <div className="pt-4">수호천사</div>
          <div className="my-1">
          <FontAwesomeIcon icon={faCoins} color="orange" />
          145</div>
          <Button className="btn btn-primary">구입하기</Button>
        </div>
        <div className={`${styles.itemBox} mx-auto`}>
        <FontAwesomeIcon icon={faSprayCan} size="3x" />
          <div className="pt-4">스프레이</div>
          <div className="my-1">
          <FontAwesomeIcon icon={faCoins} color="orange" />
          145
            </div>
          <Button className="btn btn-primary">구입하기</Button>
        </div>
      </div>
    </div>
  );
}

export default ItemStore;
