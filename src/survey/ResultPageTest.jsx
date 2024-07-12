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
        setServerResult(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <ResultPageTestContainer>
      <ProfileHeader>
        <h2>성격 유형:</h2>
        <h1>장인</h1>
        <h2>ISTP-A</h2>
      </ProfileHeader>
      <ProfileImage>
        <img src={"./SUBWAY.png"} alt="Profile" />
      </ProfileImage>
      <ProfileDescription>
        <p>
          장인은 대담하면서도 현실적인 성격으로, 모든 종류의 도구를 자유자재로
          다루는 성격 유형입니다.
        </p>
      </ProfileDescription>
      <NextButton>다음</NextButton>
    </ResultPageTestContainer>
  );
};

export default ResultPageTest;
