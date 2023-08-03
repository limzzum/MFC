import React from "react";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./itemStore.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faSprayCan, faCross, faHeartCirclePlus, faUserClock, faVolumeXmark, faHand } from "@fortawesome/free-solid-svg-icons";

function ItemStore({ allItems }) {
  const potionItem = allItems.find(item => item.name === "포션");
  const potionPrice = potionItem ? potionItem.price : 0;
  
  const speechItem = allItems.find(item => item.name === "발언 연장권");
  const speechPrice = speechItem ? speechItem.price : 0;
  
  const muteItem = allItems.find(item => item.name === "상대 음소거");
  const mutePrice = muteItem ? muteItem.price : 0;
  
  const angelItem = allItems.find(item => item.name === "수호천사");
  const angelPrice = angelItem ? angelItem.price : 0;

  const cutinItem = allItems.find(item => item.name === "끼어들기");
  const cutinPrice = cutinItem ? cutinItem.price : 0;

  const bsItem = allItems.find(item => item.name === "검정색스프레이");
  const bsPrice = bsItem ? bsItem.price : 0;

  const rsItem = allItems.find(item => item.name === "빨강색스프레이");
  const rsPrice = rsItem ? rsItem.price : 0;

  const gsItem = allItems.find(item => item.name === "초록색스프레이");
  const gsPrice = gsItem ? gsItem.price : 0;

  const bluesItem = allItems.find(item => item.name === "파랑색스프레이");
  const bluesPrice = bluesItem ? bluesItem.price : 0;

  const psItem = allItems.find(item => item.name === "보라색스프레이");
  const psPrice = psItem ? psItem.price : 0;

  const dbsItem = allItems.find(item => item.name === "도저블루스프레이");
  const dbsPrice = dbsItem ? dbsItem.price : 0;

  const grsItem = allItems.find(item => item.name === "골덴로드스프레이");
  const grsPrice = grsItem ? grsItem.price : 0;


  return (
    <div className="mt-4">
      <div className={styles.titleBox}>
        상점
      </div>
      <div className={styles.emptyBox}>
        <hr />
      </div>
      <div className={styles.flexBox}>
        <div className={`${styles.itemBox} mx-auto`}>
        <FontAwesomeIcon icon={faHeartCirclePlus} size="3x" color="red" />
          <div className="pt-4">포션</div>
          <div className="my-1">
          <FontAwesomeIcon icon={faCoins} color="orange" />
           {potionPrice}
           </div>
          <Button className="btn btn-primary">구입하기</Button>
        </div>
        <div className={`${styles.itemBox} mx-auto`}>
        <FontAwesomeIcon icon={faUserClock} size="3x" />
          <div className="pt-4">시간연장권</div>
          <div className="my-1">
          <FontAwesomeIcon icon={faCoins} color="orange" />
          {speechPrice}
          </div>
          <Button className="btn btn-primary">구입하기</Button>
        </div>
        <div className={`${styles.itemBox} mx-auto`}>
        <FontAwesomeIcon icon={faVolumeXmark} size="3x" />
          <div className="pt-4">음소거</div>
          <div className="my-1">
          <FontAwesomeIcon icon={faCoins} color="orange" />
          {mutePrice}</div>
          <Button className="btn btn-primary">구입하기</Button>
        </div>
        <div className={`${styles.itemBox} mx-auto`}>
        <FontAwesomeIcon icon={faHand} size="3x" />
          <div className="pt-4">끼어들기</div>
          <div className="my-1">          
          <FontAwesomeIcon icon={faCoins} color="orange" />
          {cutinPrice}</div>
          <Button className="btn btn-primary">구입하기</Button>
        </div>
        <div className={`${styles.itemBox} mx-auto`}>
        <FontAwesomeIcon icon={faCross} size="3x" />
          <div className="pt-4">수호천사</div>
          <div className="my-1">
          <FontAwesomeIcon icon={faCoins} color="orange" />
          {angelPrice}</div>
          <Button className="btn btn-primary">구입하기</Button>
        </div>
        </div>
        <div className={styles.flexBox}>
          <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faSprayCan} size="3x" color="black"/>
            <div className="pt-4">검은색스프레이</div>
            <div className="my-1">
            <FontAwesomeIcon icon={faCoins} color="orange" />
            { bsPrice }
              </div>
            <Button className="btn btn-primary">구입하기</Button>
          </div>
          <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faSprayCan} size="3x" color="red"/>
            <div className="pt-4">빨강색스프레이</div>
            <div className="my-1">
            <FontAwesomeIcon icon={faCoins} color="orange" />
            { rsPrice }
              </div>
            <Button className="btn btn-primary">구입하기</Button>
          </div>
          <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faSprayCan} size="3x" color="green"/>
            <div className="pt-4">초록색스프레이</div>
            <div className="my-1">
            <FontAwesomeIcon icon={faCoins} color="orange" />
            {gsPrice}
              </div>
            <Button className="btn btn-primary">구입하기</Button>
          </div>
          <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faSprayCan} size="3x" color="blue"/>
            <div className="pt-4">파랑색스프레이</div>
            <div className="my-1">
            <FontAwesomeIcon icon={faCoins} color="orange" />
            {bluesPrice}
              </div>
            <Button className="btn btn-primary">구입하기</Button>
          </div>
          <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faSprayCan} size="3x" color="purple"/>
            <div className="pt-4">보라색스프레이</div>
            <div className="my-1">
            <FontAwesomeIcon icon={faCoins} color="orange" />
            {psPrice}
              </div>
            <Button className="btn btn-primary">구입하기</Button>
          </div>
      </div>
      <div className={styles.flexBox}>
          <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faSprayCan} size="3x" color="#1E90FF"/>
            <div className="pt-4">도저블루스프레이</div>
            <div className="my-1">
            <FontAwesomeIcon icon={faCoins} color="orange" />
            {dbsPrice}
              </div>
            <Button className="btn btn-primary">구입하기</Button>
          </div>
          <div className={`${styles.itemBox} mx-auto`}>
          <FontAwesomeIcon icon={faSprayCan} size="3x" color="#DAA520"/>
            <div className="pt-4">골덴로드스프레이</div>
            <div className="my-1">
            <FontAwesomeIcon icon={faCoins} color="orange" />
            {grsPrice}
              </div>
            <Button className="btn btn-primary">구입하기</Button>
          </div>
          <div className={`${styles.itemBox} mx-auto`}></div>
          <div className={`${styles.itemBox} mx-auto`}></div>
          <div className={`${styles.itemBox} mx-auto`}></div>
          </div>
    </div>
  );
}

export default ItemStore;
