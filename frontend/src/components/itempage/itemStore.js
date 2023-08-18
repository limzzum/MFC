import styles from "./itemStore.module.css";
import Item from "./item";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

function ItemStore({ allItems, userCoin, userId, updateUserInfo }) {
  const itemRows = [];
  for (let i = 0; i < allItems.length; i += 5) {
    itemRows.push(allItems.slice(i, i + 5));
  }

  return (
    <div>
      <p className={styles.title}>
        <FontAwesomeIcon icon={faCartShopping} size="lg" />
        &nbsp;상점
      </p>
      <hr />
      {itemRows.map((row, rowIndex) => (
        <div className={styles.flexBox} key={rowIndex}>
          {row.map((item) => (
            <Item
              key={item.name}
              iconName={item.iconName}
              name={item.name}
              price={item.price}
              userCoin={userCoin}
              color={item.rgb}
              userId={userId}
              updateUserInfo={updateUserInfo}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default ItemStore;
