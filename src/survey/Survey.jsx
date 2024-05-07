import React, { useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { getNextQuestion } from "./SurveyApi";
import { Navigate, useNavigate } from "react-router-dom";

const questions = [
  { title: "Question 1", options: ["Option 1A", "Option 1B"] },
  { title: "Question 2", options: ["Option 2A", "Option 2B"] },
  { title: "Final Question", options: ["Final A", "Final B"] },
];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

const Header = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 24px;
`;

const Options = styled.div`
  display: flex;
  width: 100%;
  height: 90%;
  align-items: center;
  justify-content: center;
`;

const fadeOutLeft = keyframes`
  from { opacity: 1; }
  to { opacity: 0; transform: translateX(-100%); }
`;

const fadeOutRight = keyframes`
  from { opacity: 1; }
  to { opacity: 0; transform: translateX(100%); }
`;

const stayLeft = keyframes`
  from {
    
  }
  to {
    transform: scale(1.1) translateX(calc(50% - 5%));
  }
`;

const stayRight = keyframes`
  from {
    
  }
  to {
    transform: scale(1.1) translateX(calc(-50% + 5%));
  }
`;

// 로직을 별도의 함수로 분리
const selectAnimation = (props) => {
  if (!props.$animate) {
    return css`none`;
  }
  if (props.$isSelected) {
    return props.$index === 0 ? stayLeft : stayRight;
  }
  return props.$index === 0 ? fadeOutLeft : fadeOutRight;
};

const Option = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  cursor: pointer;
  background-color: ${(props) => props.color};
  animation: ${(props) =>
    css`
      ${selectAnimation(props)} 0.5s forwards
    `};
  animation-fill-mode: forwards; // 애니메이션 완료 상태 유지
`;

const VS = styled.div`
  position: absolute;
  font-size: 48px;
  color: red;
`;

const Survey = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [animate, setAnimate] = useState(false);

  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const result = useRef([]);

  useEffect(() => {
    console.log("useeffct");
    getNextQuestion()
      .then((response) => {
        setQuestionData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleOptionClick = (index) => {
    console.log("handleoptionClick");
    const selectedOption2 = index;

    //결과저장
    if (selectedOption2 == 1) {
      result.current[questionData.questionIndex] =
        questionData.options[selectedOption2].duration;
    }

    console.log(result.current);

    setSelectedOption(() => index);
    setAnimate(true);
    setTimeout(() => {
      getNextQuestion(
        questionData.questionIndex,
        questionData.followUpQuestionIndex,
        selectedOption2,
        questionData.options
      )
        .then((response) => {
          if (response.data.isLastQuestion) {
            //alert("You have completed the questions!");
            navigate("/results", { state: { result: result } });
          } else {
            setQuestionData(response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });

      setSelectedOption(null);
      setAnimate(false);
    }, 500);
  };

  return (
    <Container>
      <Header>대중교통 MBTI</Header>
      <Options>
        {questionData &&
          questionData.options &&
          questionData.options.map((option, index) => (
            <Option
              key={index}
              color={index === 0 ? "lightblue" : "lightgreen"}
              onClick={() => handleOptionClick(index)}
              $isSelected={selectedOption === index}
              $animate={animate}
              $index={index}
              $selectedOption={selectedOption}
            >
              {option.transport}: {option.duration} 분
            </Option>
          ))}
        <VS>VS</VS>
      </Options>
      <h4>서버로부터 받은 데이터</h4>
      <pre>{JSON.stringify(questionData, null, 2)}</pre>
    </Container>
  );
};

export default Survey;
