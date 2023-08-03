import HavingItem from '../../components/itempage/havingItem.js'
import ItemStore from '../../components/itempage/itemStore.js'

import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom"

function ItemPage() {
    const userId = useParams()

    return (
        <div>
            <HavingItem />
            <ItemStore />
        </div>
    );

}

export default ItemPage;