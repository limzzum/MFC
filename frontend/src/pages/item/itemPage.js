import { useState, useEffect } from 'react';
import HavingItem from '../../components/itempage/havingItem.js'
import ItemStore from '../../components/itempage/itemStore.js'

import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom"
import axios from 'axios';

function ItemPage() {
    const userId = useParams()
    const [ userItems, setUserItems ] = useState([]);

    useEffect(() => {
        fetchUserItems(userId);
    }, [userId]);
    
    const fetchUserItems = (userId) => {
        axios.get(`api/item/list/${userId}`)
            .then(response => {
                setUserItems(response.data);
            })
            .catch(error => {
                console.error("아이템 정보 가져오기 오류:", error);
            });
        };
    return (
        <div>
            <HavingItem userItems={userItems} />
            <ItemStore />
        </div>
    );

}

export default ItemPage;