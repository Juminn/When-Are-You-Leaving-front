// src/ProfileCard.js

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getSurveyResult } from "./SurveyApi";
//import profileImage from "../../public/BUS.png"; // Make sure to import the image

const ResultPageTestContainer = styled.div`
  width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
  background-color: #f9f9f9;
`;

const ProfileHeader = styled.div`
  h2 {
    margin: 0;
    color: #888;
  }
  h1 {
    margin: 10px 0;
    color: #333;
  }
`;

const ProfileImage = styled.div`
  img {
    width: 100px;
    height: auto;
  }
`;

const ProfileDescription = styled.div`
  margin: 20px 0;
  color: #666;
`;

const NextButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const ResultPageTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const [serverResult, setServerResult] = useState(null);

  //서버에 결과데이터요청
  useEffect(() => {
    console.log("ResultPage useeffct");
    console.log(result);
    getSurveyResult(result)
      .then((response) => {
        console.log("serverResult: ", serverResult);
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
      {serverResult && (
        <ResultPageTestContainer>
          <ProfileHeader>
            <h2>대중교통MBTI:</h2>
            <h1>{serverResult.mbti}</h1>
          </ProfileHeader>
          <ProfileImage>
            <img src={"./" + serverResult.mbti + ".png"} alt="Profile" />
          </ProfileImage>
          <ProfileDescription>
            <p>{serverResult.mbtiDescription}</p>
          </ProfileDescription>
          <NextButton onClick={handleGoToAddressMap}>
            설문 결과를 바탕으로 출근 시간 추천받기
          </NextButton>
        </ResultPageTestContainer>
      )}
    </div>
  );
};

export default ResultPageTest;
