// ResultsPage 컴포넌트
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSurveyResult } from "./SurveyApi";
import styled from "styled-components";

const Button = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  // margin-right: auto; // 오른쪽 정렬을 위해
  margin-bottom: 500px;
  display: block;
`;

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const [serverResult, setServerResult] = useState(null);

  useEffect(() => {
    console.log("ResultPage useeffct");
    console.log(result);
    getSurveyResult(result)
      .then((response) => {
        setServerResult(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // 버튼 클릭 핸들러
  const handleGoToAddressMap = () => {
    const { mbti, mbtiDescription, ...settings } = serverResult; // mbti 속성을 제외한 나머지를 settings 객체로 추출
    navigate("/", { state: { settings: settings } });
  };

  return (
    <div>
      <h1>결과 페이지</h1>
      {serverResult && (
        <div>
          <h4>{serverResult.mbtiDescription}</h4>
          <Button onClick={handleGoToAddressMap}>
            나의 대중교통 선호도 및 기회비용을 바탕으로 출근시간, 출발시간
            추천받기
          </Button>
        </div>
      )}

      <pre>{JSON.stringify(result, null, 2)}</pre>
      <pre>{JSON.stringify(serverResult, null, 2)}</pre>
    </div>
  );
};

export default ResultsPage;
