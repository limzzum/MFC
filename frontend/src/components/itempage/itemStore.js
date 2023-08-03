import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./itemStore.module.css";
import Item from "./item";

function ItemStore({ allItems, userCoin }) {
  return (
    <div className="mt-4">
      <div className={styles.titleBox}>상점</div>
      <div className={styles.emptyBox}>
        <hr />
      </div>
      <div className={styles.flexBox}>
        {allItems.map(item => (
          <Item
            key={item.name}
            icon={item.icon}
            name={item.name}
            price={item.price}
            userCoin = {userCoin}
          />
        ))}
      </div>
    </div>
  );
}

export default ItemStore;
