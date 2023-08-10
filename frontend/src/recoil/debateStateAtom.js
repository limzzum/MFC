import { atom, selectorFamily, useRecoilState } from "recoil";
import { getRoomInfo } from "../api/getRoomInfoAPI";
import { getVoteResult } from "../api/getVoteResultAPI";

export const debateRoomState = atom({
  key: "debateRoomState",
  default: {},
});

export const voteResultState = atom({
  key: "voteResultState",
  default: {},
});

// API 호출 결과를 Recoil selector로 관리
export const getDebateRoomState = selectorFamily({
  key: "getDebateRoomState",
  get: (roomId) => async () => {
    const data = await getRoomInfo(roomId);

    if (data) {
      // API 호출 결과가 있으면, debateRoomState에 저장
      return data;
    } else {
      return null;
    }
  },
});

export const getVoteResultState = selectorFamily({
  key: "getVoteResultState",
  get: (roomId) => async () => {
    const data = await getVoteResult(roomId);

    if (data) {
      // API 호출 결과가 있으면, voteResultState에 저장
      return data;
    } else {
      return null;
    }
  },
});

export const statusState = atom({
  key: "statusState",
  default: "waiting", // 토론 시작 전 대기 상태
});

export const roleState = atom({
  key: "roleState",
  default: "spectator", // 토론방 입장 시 관전자로 입장
});

// status와 role 상태를 사용하는 커스텀 훅
export function useStatus() {
  return useRecoilState(statusState);
}

export function useRole() {
  return useRecoilState(roleState);
}
