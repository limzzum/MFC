import React from 'react';
import style from './mainPage.module.css';
import personImage from '../../images/person.png'
import { BsPlusSquare } from "react-icons/bs";
import { BsStopwatch } from "react-icons/bs";
import { RiSpeakLine } from "react-icons/ri";

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

        <div className=''>
          <div className="card" style={{ width: '18rem' }}>
            <div className="d-flex">
              <div className={style.imgbox}>
                <img src={personImage} style={{ maxWidth: '100%' }} alt="..." />
              </div>
              <div className={style.imgbox}>
                <img src={personImage} style={{ maxWidth: '100%' }} alt="..." />
              </div>
            </div>


            <div className={style.cardbody}>
              <p className={style.cardtitle}>송강 호떡 사주기 VS 송강호 떡 사주기</p>

              <div>
                <BsStopwatch className={style.timeicon} />
                <span className="card-text">토론 시간</span>
              </div>
              <div>
                <RiSpeakLine className={style.timeicon} />
                <span className="card-text">발언 제한 시간</span>
              </div>

            </div>


            <div className="card-body">
              <div className={style.joinbuttoncontainer}>
                <button className={style.joinbutton}>
                  참여하기
                </button>
              </div>
            </div>
          </div>
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
