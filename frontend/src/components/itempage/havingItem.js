import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./havingItem.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faCross, faHeartCirclePlus, faUserClock, faVolumeXmark, faHand } from "@fortawesome/free-solid-svg-icons";

function HavingItem({ userItems, userCoin }) {

  const potionItem = userItems.find(item => item.name === "포션");
  const potionCount = potionItem ? potionItem.count : 0;
  
  const speechItem = userItems.find(item => item.name === "발언 연장권");
  const speechCount = speechItem ? speechItem.count : 0;
  
  const muteItem = userItems.find(item => item.name === "상대 음소거");
  const muteCount = muteItem ? muteItem.count : 0;
  
  const angelItem = userItems.find(item => item.name === "수호천사");
  const angelCount = angelItem ? angelItem.count : 0;

  const cutinItem = userItems.find(item => item.name === "끼어들기");
  const cutinCount = cutinItem ? cutinItem.count : 0;

  return (
    <div>
      <div className={styles.titleBox}>
        <div className={styles.title}>보유중인 아이템</div>
        <div className="my-auto">
        <FontAwesomeIcon icon={faCoins} color="orange"/>
        </div>
        <div className={styles.textCoin}>{userCoin} Coin</div>
      </div>
      <div className={styles.emptyBox}>
        <hr />
      </div>
      <div className={styles.flexBox}>
        <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faHeartCirclePlus} size="3x" />
          <div className="pt-4">포션</div>
          <div>X {potionCount} </div>
        </div>
        <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faUserClock} size="3x" />
          <div className="pt-4">발언 연장권</div>
          <div>X {speechCount}</div>
        </div>
        <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faVolumeXmark} size="3x" />
          <div className="pt-4">음소거</div>
          <div>X {muteCount}</div>
        </div>
        <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faHand} size="3x" />
          <div className="pt-4">끼어들기</div>
          <div>X {cutinCount}</div>
        </div>
        <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faCross} size="3x" />
          <div className="pt-4">수호천사</div>
          <div>X {angelCount}</div>
        </div>
      </div>
    </div>
  );
}

export default HavingItem;
