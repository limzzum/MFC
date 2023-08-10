import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./havingItem.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faCross,
  faHeartCirclePlus,
  faUserClock,
  faVolumeXmark,
  faHand,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

function HavingItem({ userItems, userCoin }) {
  const potionItem = userItems.find((item) => item.name === "포션");
  const potionCount = potionItem ? potionItem.count : 0;

  const speechItem = userItems.find((item) => item.name === "발언 연장권");
  const speechCount = speechItem ? speechItem.count : 0;

  const muteItem = userItems.find((item) => item.name === "상대 음소거");
  const muteCount = muteItem ? muteItem.count : 0;

  const angelItem = userItems.find((item) => item.name === "수호천사");
  const angelCount = angelItem ? angelItem.count : 0;

  const cutinItem = userItems.find((item) => item.name === "끼어들기");
  const cutinCount = cutinItem ? cutinItem.count : 0;

  return (
    <div>
      <div className={styles.titleBox}>
        <div className={styles.title}>보유중인 아이템</div>
        <div className={styles.textCoin}>
          <FontAwesomeIcon icon={faCoins} color="orange" />
          &nbsp;{userCoin}
        </div>
      </div>
      <hr />
      <div className={`${styles.flexBox} mt-4`}>
        <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faHeartCirclePlus} size="3x" />
          <p className="pt-4">포션</p>
          <p className={styles.count}>
            <FontAwesomeIcon icon={faXmark} />
            &nbsp;{potionCount}
          </p>
        </div>
        <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faUserClock} size="3x" />
          <p className="pt-4">발언 연장권</p>
          <p className={styles.count}>
            <FontAwesomeIcon icon={faXmark} />
            &nbsp;{speechCount}
          </p>
        </div>
        <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faVolumeXmark} size="3x" />
          <p className="pt-4">음소거</p>
          <p className={styles.count}>
            <FontAwesomeIcon icon={faXmark} />
            &nbsp;{muteCount}
          </p>
        </div>
        <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faHand} size="3x" />
          <p className="pt-4">끼어들기</p>
          <p className={styles.count}>
            <FontAwesomeIcon icon={faXmark} />
            &nbsp;{cutinCount}
          </p>
        </div>
        <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faCross} size="3x" />
          <p className="pt-4">수호천사</p>
          <p className={styles.count}>
            <FontAwesomeIcon icon={faXmark} />
            &nbsp;{angelCount}
          </p>
        </div>
      </div>
    </div>
  );
}

export default HavingItem;
