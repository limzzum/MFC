import axios from "axios";

const BASE_URL = "https://goldenteam.site/api/viewer";

export const getParticipate = async (roomId) => {
    try{
        const response = await axios.get(`${BASE_URL}/list/${roomId}`);
        return response.data;
    }catch (e){
        console.log(`토론방 참여 API 오류: ${e}`);
        return null;
    }
}