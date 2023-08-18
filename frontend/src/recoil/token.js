import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const {persistAtom} = recoilPersist()
// 토큰을 저장하는 Recoil atom
export const userState = atom({
  key: 'userState', // 고유한 ID (다른 atom과 중복되지 않아야 함)
  default: { token: '' }, // 기본값
  effects_UNSTABLE: [persistAtom]
});
