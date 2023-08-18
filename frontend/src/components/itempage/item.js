import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeartCirclePlus,
  faUserClock,
  faVolumeXmark,
  faHand,
  faCross,
  faSprayCan,
  faCoins,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./itemStore.module.css";
import axios from "axios";

function Item({
  iconName,
  name,
  price,
  userCoin,
  color,
  userId,
  updateUserInfo,
}) {
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = () => {
    if (userCoin >= price) {
      setPurchasing(true);
      axios
        .post(
          `https://goldenteam.site/api/item/purchase/${userId}?itemName=${name}`
        )
        .then((response) => {
          console.log(response);
          console.log(`Item ${name} purchased successfully!`);
          updateUserInfo();
        })
        .catch((error) => {
          console.error("Error purchasing item:", error);
        })
        .finally(() => {
          setPurchasing(false);
        });
    } else {
      alert("잔액이 부족합니다.");
    }
  };

  const iconMap = {
    faHeartCirclePlus: faHeartCirclePlus,
    faUserClock: faUserClock,
    faVolumeXmark: faVolumeXmark,
    faHand: faHand,
    faCross: faCross,
    faSprayCan: faSprayCan,
    faCoins,
    // 추가적인 아이콘들도 이곳에 추가해주세요
  };
  const iconComponent = iconMap[iconName];

  return (
    <div className={`${styles.itemBox}`}>
      <FontAwesomeIcon icon={iconComponent} size="3x" color={color} />
      <p className={`${styles.itemName} py-2`}>{name}</p>
      <p className={`${styles.coin} pb-2`}>
        <FontAwesomeIcon icon={faCoins} color="orange" />
        &nbsp;{price}
      </p>
      <button
        className={`${styles.buyBtn} btn`}
        disabled={purchasing}
        onClick={handlePurchase}
      >
        {purchasing ? "구매 중..." : "구매"}
      </button>
    </div>
  );
}

export default Item;
