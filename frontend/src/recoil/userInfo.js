import { atom } from 'recoil';

export const userInfoState = atom({
  key: 'userInfoState',
  default: {
    id: null,
    email: "",
    nickname: "",
    profile: "",
    deleted: false,
    colorItem: {id: null, name: "", iconName: "", comment: "", price: null, rgb: ""}
  }
});
