import React from "react";

const RouteResult = ({ isLoading, recommand, costServerData }) => {
  if (isLoading) {
    return <h2>계산 중.....</h2>;
  }

  return (
    <div>
      <h2>추천 시간 출력</h2>
      <pre style={{ fontSize: "20px" }}>{recommand}</pre>

      <h1>서버로부터 받은 데이터</h1>
      <pre>{JSON.stringify(costServerData, null, 2)}</pre>
    </div>
  );
};

export default RouteResult;
