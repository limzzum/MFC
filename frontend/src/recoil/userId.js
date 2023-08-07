import { atom } from 'recoil';

export const userIdState = atom({
  key: 'userIdState', // unique ID (with respect to other atoms/selectors)
  default: '', // default value (aka initial value)
});
