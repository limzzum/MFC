import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const {persistAtom} = recoilPersist()

export const minRoomIdState = atom({
  key: 'minRoomIdState',
  default: null,
});


export const minWaitingRoomIdState = atom({
  key: 'minWaitingRoomIdState',
  default: null,
  effects_UNSTABLE: [persistAtom]
});
