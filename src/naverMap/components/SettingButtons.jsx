// EasySettingButton.js
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const SettingsContainer = styled.div`
  display: flex; // flexbox를 사용하여 내부 요소들을 수평으로 배치
  align-items: center; // 세로 방향 중앙 정렬
  justify-content: space-between; // 내부 요소 사이에 공간을 균등하게 배분
  //padding: 10px;
  padding-bottom: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: right; // 오른쪽 정렬을 위해
  display: block;

  margin-right: 10px; // 모든 버튼에 오른쪽 마진 추가
  &:last-child {
    margin-right: 0; // 마지막 버튼의 오른쪽 마진 제거
  }
`;

const SettingButtons = ({ showDetails, setShowDetails }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/survey");
  };

  return (
    <SettingsContainer>
      <Button onClick={() => setShowDetails(!showDetails)}>상세 설정</Button>
      <Button onClick={handleNavigate}>간편설정 - 대중교통 MBTI 측정</Button>
    </SettingsContainer>
  );
};

export default SettingButtons;
