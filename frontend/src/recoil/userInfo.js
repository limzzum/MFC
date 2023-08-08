import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const userInfoState = atom({
  key: 'userInfoState',
  default: {
    id: null,
    email: "",
    nickname: "",
    profile: "",
    deleted: false,
    colorItem: {id: null, name: "", iconName: "", comment: "", price: null, rgb: ""}
  },
  effects_UNSTABLE: [persistAtom],
});
