import React, { useEffect } from "react";
import { ProgressBar } from "react-bootstrap";
import UserVideoComponent from "../Openvidu/UserVideoComponent";
import { FaVoteYea } from "react-icons/fa";
import style from "../debatePage.module.css";
import { useStompClient } from "../../../SocketContext";
// import { SOCKET_BASE_URL } from "../../../config";
// import SockJS from "sockjs-client";
// import Stomp from "webstomp-client";
// import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

// import { valueState} from '../../../recoil/debateStateAtom';
// import { useRecoilValue } from 'recoil';

// import leftVector from "../../../images/leftVector.png";
// import rightVector from "../../../images/rightVector.png";

function Spectator({ voteResult, filteredSubscribers, setVoteResult, roomId }) {
  const stompClient = useStompClient();

  // const values = useRecoilValue(valueState); 리코일 값을 가져옴
  // 리코일로 벨류 변경하기 위해서 선언
  // const value1 = values.value1;
  // const value2 = values.value2;
  const value1 = voteResult.totalCountA;
  const value2 = voteResult.totalCountB;
  const totalValue = value1 + value2;
  const ratio1 =
    value1 === 0 && value2 === 0 ? 50 : (value1 / totalValue) * 100;
  const ratio2 =
    value1 === 0 && value2 === 0 ? 50 : (value2 / totalValue) * 100;

  useEffect(() => {
    if (stompClient) {
      stompClient.subscribe(`/from/vote/${roomId}`, (message) => {
        const voteResultMessage = JSON.parse(message.body);
        setVoteResult(voteResultMessage);
      });
    }
    // eslint-disable-next-line
  }, [stompClient]);

  // const spectatorCnt = debateRoomInfo.maxPeople <= 2 ? 0 : debateRoomInfo.maxPeople - 2;
  return (
    <div className={style.Spectator}>
      <div className={style.voteTitle}>
        <FaVoteYea size={35} />
        &nbsp;투표 결과
      </div>
      <div className={style.voteResult}>
        <ProgressBar className={`${style.voteBar}`}>
          <ProgressBar
            className={`${style.voteBarA}`}
            label={`여기에 주제를 적었으면 좋겠다. ${value1}`}
            now={ratio1}
            key={1}
          />
          <ProgressBar
            className={`${style.voteBarB}`}
            label={`여기도 ${value2}`}
            now={ratio2}
            key={2}
          />
        </ProgressBar>
      </div>
      <div className={`${style.spectatorList}`}>
        {/* <button className={`${style.leftButton} btn`}>
          <AiFillCaretLeft size={40} />
        </button> */}
        {/* {[...Array(spectatorCnt)].map((_, index) => (
                        <div key={index}>
                            <video className={style.spectator} ref={userVideoRef} autoPlay muted />
                        </div>
                    ))} */}
        {filteredSubscribers.map((sub, i) => (
          <div key={sub.id} className={style.Spectator}>
            <span>{sub.id}</span>
            <UserVideoComponent streamManager={sub} called={style.spectator} />
          </div>
        ))}
        {/* <button className={`${style.rightButton} btn`}>
          <AiFillCaretRight size={40} />
        </button> */}
      </div>
    </div>
  );
}

export default Spectator;
