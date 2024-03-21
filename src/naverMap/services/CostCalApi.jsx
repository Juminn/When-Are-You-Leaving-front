const minCostRouteRequestApi = (
  startX,
  startY,
  goalX,
  goalY,
  startTime,
  endTime,
  opportunityCost,
  subwayCost,
  busCost,
  walkingCost
) => {
  const apiUrl = process.env.REACT_APP_API_ENDPOINT;

  axios
    .get(
      `${apiUrl}/a?` +
        `startX=${startX}&` +
        `startY=${startY}&` +
        `goalX=${goalX}&` +
        `goalY=${goalY}&` +
        `startTime=2024-02-05T${startTime}&` +
        `endTime=2024-02-05T${endTime}&` +
        `opportunityCost=${opportunityCost}&` +
        `subwayCost=${subwayCost}&` +
        `busCost=${busCost}&` +
        `walkingCost=${walkingCost}`
    )
    .then((response) => {
      // 데이터 처리
      console.log("minCostRouteRequestApi Success, response: " + response.data);
      return response;
    })
    .catch((error) => {
      // 오류 처리
      console.error("minCostRouteRequestApi False:", error);
      alert(
        "서버 요청에 실패했습니다. 새로고침 후 다시 시도해주세요. Error:" +
          error.message
      );
      return;
    });
};
