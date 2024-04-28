import React from "react";
import RouteTimeline from "./RouteTimeline";

const RouteResult = ({ isLoading, minCostRoute, costServerData }) => {
  if (isLoading) {
    return (
      <div>
        <h2>계산 중.....</h2>
        <h4>시간 범위에 따라 최장 10분까지 계산 시간이 소요됩니다.</h4>
      </div>
    );
  }

  return (
    <div>
      <h4>추천 출발 시간</h4>
      {/* <pre>{recommand}</pre> */}
      <RouteTimeline minCostRoute={minCostRoute} />

      <h4>서버로부터 받은 데이터</h4>
      <pre>{JSON.stringify(costServerData, null, 2)}</pre>
    </div>
  );
};

export default RouteResult;
