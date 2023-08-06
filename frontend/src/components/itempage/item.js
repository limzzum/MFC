import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartCirclePlus, faUserClock, faVolumeXmark, faHand, faCross, faSprayCan, faCoins } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import styles from "./itemStore.module.css";
import axios from "axios";

function Item({ iconName, name, price, userCoin, color, userId }) {
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = () => {
    if (userCoin >= price) {
      setPurchasing(true);
      axios.post(`http://i9a605.p.ssafy.io:8081/api/item/purchase/${userId}?itemName=${name}`)
        .then(response => {
          console.log(response)
          console.log(`Item ${name} purchased successfully!`);
        })
        .catch(error => {
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
    "faHeartCirclePlus" : faHeartCirclePlus,
    "faUserClock" : faUserClock,
    "faVolumeXmark" : faVolumeXmark,
    "faHand" : faHand,
    "faCross" : faCross,
    "faSprayCan" : faSprayCan,
    faCoins
    // 추가적인 아이콘들도 이곳에 추가해주세요
  };
  const iconComponent = iconMap[iconName]; 

  return (
    <div className={`${styles.itemBox}`}>
      <FontAwesomeIcon icon={iconComponent} size="3x" color={color}/>

      <div className="pt-4">{name}</div>
      <div className="my-1">
        <FontAwesomeIcon icon={faCoins} color="orange" />
        {price}
      </div>
      <Button
        className="btn btn-primary"
        disabled={purchasing}
        onClick={handlePurchase}
      >
        {purchasing ? "구매 중..." : "구입하기"}
      </Button>
    </div>
  );
}

export default Item;
