// ResultsPage 컴포넌트
import React from "react";
import { useLocation } from "react-router-dom";

const ResultsPage = () => {
  const location = useLocation();
  const result = location.state?.result;

  return (
    <div>
      <h1>결과 페이지</h1>
      <p>여기에 설문 결과를 표시합니다.</p>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
};

export default ResultsPage;
