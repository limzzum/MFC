import axios from "axios";

const BASE_URL = "https://goldenteam.site/api/debate";

export const getRoomInfo = async (roomId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${roomId}`); // 추후에 클릭한 토론방 번호 들어가도록 수정 필요
    return response.data;
  } catch (e) {
    console.log(`토론방 정보 API 오류: ${e}`);
    return null;
  }
};
