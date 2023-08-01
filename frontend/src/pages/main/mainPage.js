import React from 'react';
import style from './mainPage.module.css';
import { BsPlusSquare } from "react-icons/bs";
import DebateRoomCard from '../../components/mainpage/debateRoomCard';

function mainPage() {
  return (
    <div className='container'>
      <div className='innercontents'>

        <div className={style.titlebox}>
          <span className={style.title}>참여 가능한 토론방</span>
          <div className={style.createroombuttoncontainer}>
            <button className={`btn ${style.createroombutton}`}>
              <BsPlusSquare className={style.createroombuttonicon} />
            </button>
          </div>
        </div>

        <hr className={style.horizontalline} />

       
         <div>
            <DebateRoomCard/>
         </div>

        <hr className={style.horizontalline} />

        <div className={style.titlebox}>
          <span className={style.title}>진행 중인 토론방</span>
        </div>

      </div>
    </div>
  )
}

export default mainPage;
