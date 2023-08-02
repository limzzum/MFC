import {atom, useRecoilState} from 'recoil';

export const statusState = atom({
    key: 'statusState',
    default: 'waiting', // 토론 시작 전 대기 상태
});

export const roleState = atom({
    key: 'roleState',
    default: 'spectator', // 토론방 입장 시 관전자로 입장
});

// status와 role 상태를 사용하는 커스텀 훅
export function useStatus() {
    return useRecoilState(statusState);
}

export function useRole() {
    return useRecoilState(roleState);
}