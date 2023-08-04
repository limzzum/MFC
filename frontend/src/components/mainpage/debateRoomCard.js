import React, { Component } from 'react';
import style from './debateRoomCard.module.css';
import personImage from '../../images/person.png';
import { BsStopwatch } from 'react-icons/bs';
import { RiSpeakLine } from 'react-icons/ri';

class DebateRoomCard extends Component {
  render() {
    const { title1, title2, debateTime, speechTime } = this.props;

    return (
      <div className=''>
        <div className='card' style={{ width: '18rem' }}>
          <div className='d-flex'>
            <div className={style.imgbox}>
              <img src={personImage} style={{ maxWidth: '100%' }} alt='none' />
            </div>
            <div className={style.imgbox}>
              <img src={personImage} style={{ maxWidth: '100%' }} alt='none' />
            </div>
          </div>
          <div className={style.cardbody}>
            <p className={style.cardtitle}>{title1} VS {title2}</p>
            <div>
              <BsStopwatch className={style.timeicon} />
              <span className={style.cardtext}>토론 시간: {debateTime}분</span>
            </div>
            <div>
              <RiSpeakLine className={style.timeicon} />
              <span className={style.cardtext}>발언 제한 시간: {speechTime}분</span>
            </div>
          </div>
          <div className='card-body'>
            <div className={style.joinbuttoncontainer}>
              <button className={style.joinbutton}>참여하기</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DebateRoomCard;
