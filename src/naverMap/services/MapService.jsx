//현재 미사용중jsx
import { minCostRouteRequestApi } from "./CostCalApi";

//최소비용 경로와 시간 요청
const requestMinCostRoute = async (
  startMarkerRef,
  endMarkerRef,
  startTime,
  endTime,
  setShowResult,
  setIsLoading
) => {
  //전처리
  if (startMarkerRef.current == null || endMarkerRef.current == null) {
    return;
  }
  if (startTime > endTime) {
    alert("종료시간이 시작시간보다 빠를 수 없습니다. ");
    return;
  }

  //로직시작s
  setShowResult(true);
  setIsLoading(true);

  const response = await minCostRouteRequestApi(
    startMarkerRef.current.getPosition().lng(),
    startMarkerRef.current.getPosition().lat(),
    endMarkerRef.current.getPosition().lng(),
    endMarkerRef.current.getPosition().lat(),
    "2024-02-05T" + startTime,
    "2024-02-05T" + endTime,
    settings.opportunityCost,
    settings.subwayCost,
    settings.busCost,
    settings.walkingCost
  );

  console.log(response); // 데이터 처리
  setCostServerData(response);
  makeRecommand(response);

  setIsLoading(false);
};
