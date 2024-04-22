import React from "react";
import RouteTimeline from "./RouteTimeline";

const RouteResult = ({ isLoading, recommand, costServerData }) => {
  if (isLoading) {
    return <h2>계산 중.....</h2>;
  }

  return (
    <div>
      <h4>추천 시간</h4>
      {/* <pre>{recommand}</pre> */}

      <h4>서버로부터 받은 데이터</h4>
      <pre>{JSON.stringify(costServerData, null, 2)}</pre>
    </div>
  );
};

export default RouteResult;
