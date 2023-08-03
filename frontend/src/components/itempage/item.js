import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartCirclePlus, faUserClock, faVolumeXmark, faHand, faCross, faSprayCan, faCoins } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import styles from "./itemStore.module.css";
import axios from "axios";

function Item({ iconName, name, price, userCoin }) {
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = () => {
    if (userCoin >= price) {
      setPurchasing(true);
      axios
        .post(`api/item/purchase/{userId}/itemname=${name}`)
        .then(response => {
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

  return (
    <div className={`${styles.itemBox} mx-auto`}>
      <FontAwesomeIcon icon={iconName} size="3x" />

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
