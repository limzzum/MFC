import axios from 'axios';

const BASE_URL = 'http://i9a605.p.ssafy.io:8081/api/viewer/vote'

export const getVoteResult = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/1`);  // 추후에 클릭한 토론방 번호 들어가도록 수정 필요
        return response.data;
    } catch (e) {
        console.log(`토론방 정보 API 오류: ${e}`);
        return null;
    }
};

export const patchVoteResult = async (voteResult) => {
    try{
        const response = await axios.patch(`${BASE_URL}/1/1`, {voteResult});
        return response.data;
    }catch(e){
        console.log(`토론방 정보 API 오류: ${e}`);
        return null;
    }
}