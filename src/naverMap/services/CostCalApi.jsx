import axios from "axios";

export const minCostRouteRequestApi = async (
  startX,
  startY,
  goalX,
  goalY,
  startTime,
  endTime,
  transferCost,
  subwayCost,
  busCost,
  walkingCost
) => {
  const apiUrl = process.env.REACT_APP_API_ENDPOINT;

  const response = await axios
    .get(
      `${apiUrl}/a?` +
        `startX=${startX}&` +
        `startY=${startY}&` +
        `goalX=${goalX}&` +
        `goalY=${goalY}&` +
        `startTime=${startTime}&` +
        `endTime=${endTime}&` +
        `transferCost=${transferCost}&` +
        `subwayCost=${subwayCost}&` +
        `busCost=${busCost}&` +
        `walkingCost=${walkingCost}`
    )
    .catch((error) => {
      // 오류 처리
      // console.error("minCostRouteRequestApi False:", error);
      // alert(
      //   "서버 요청에 실패했습니다. 새로고침 후 다시 시도해주세요. " +
      //     "error message: " +
      //     error.message +
      //     "error response: " +
      //     error.response +
      //     "error request: " +
      //     error.request
      // );

      if (error.response) {
        // 서버가 에러 메시지와 함께 응답한 경우
        console.error("Server response error:", error.response.data);
        // 에러 메시지를 알림으로 보여주기
        alert(
          `서버 요청에 실패했습니다. ${
            error.response.data.message ||
            error.response.data ||
            "An unknown error occurred."
          }`
        );
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        console.error("No response received:", error.request);
        alert(
          "서버 요청에 실패했습니다. No response was received. Please check your network connection and try again."
        );
      } else {
        // 요청 설정 중 오류가 발생한 경우
        console.error(
          "서버 요청에 실패했습니다. Error setting up request:",
          error.message
        );
        alert(`Request setup error: ${error.message}`);
      }

      return {
        data: null,
      };
    });

  return response.data;
};
