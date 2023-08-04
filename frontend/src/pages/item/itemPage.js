import { useState, useEffect } from 'react';
import HavingItem from '../../components/itempage/havingItem.js'
import ItemStore from '../../components/itempage/itemStore.js'

import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom"
import axios from 'axios';

function ItemPage() {
    const userId = useParams()
    const [ userItems, setUserItems ] = useState([]);
    const [ userCoin, setUserCoin ] = useState(0);
    const [ allItems, setAllItems ] =useState([])

    useEffect(() => {
        fetchUserItems(userId);
        fetchUserCoin(userId);
        fetchAllItems();
    }, [userId]);
    
    const fetchUserItems = (userId) => {
        axios.get(`http://i9a605.p.ssafy.io:8081/api/item/list/${userId}`)
            .then(response => {
                setUserItems(response.data);
            })
            .catch(error => {
                console.error("아이템 정보 가져오기 오류:", error);
            });
        };

    const fetchUserCoin = (userId) => { 
        axios.get(`http://i9a605.p.ssafy.io:8081/api/record/${userId}`)
            .then(response => {
                setUserCoin(response.data.coin);
            })
            .catch(error => {
                console.error("코인 정보 가져오기 오류:", error);
            });
    };
    
    const fetchAllItems = () => { 
        axios.get(`http://i9a605.p.ssafy.io:8081/api/item/list`)
            .then(response => {
                console.log(response)
                setAllItems(response.data.data);
            })
            .catch(error => {
                console.error("아이템 정보 가져오기 오류:", error);
            });
    };

    return (
        <div>
            <HavingItem userItems={userItems} userCoin={userCoin}/>
            <ItemStore allItems={allItems} userCoin={userCoin}/>
        </div>
    );

}

export default ItemPage;