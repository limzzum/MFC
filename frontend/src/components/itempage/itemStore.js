import styles from "./itemStore.module.css";
import Item from "./item";

function ItemStore({ allItems, userCoin }) {
  const itemRows = [];
  for (let i = 0; i < allItems.length; i += 5) {
    itemRows.push(allItems.slice(i, i + 5));
  }

  return (
    <div className="mt-4">
      <div className={styles.titleBox}>상점</div>
      <div className={styles.emptyBox}>
        <hr />
      </div>
      {itemRows.map((row, rowIndex) => (
        <div className={styles.flexBox} key={rowIndex}>
          {row.map(item => (
            <Item
              key={item.name}
              iconName={item.iconName}
              name={item.name}
              price={item.price}
              userCoin={userCoin}
              color={item.rgb}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default ItemStore;
