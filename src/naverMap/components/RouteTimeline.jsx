import React from "react";
import styled from "styled-components";

// Timeline 전체를 감싸는 컨테이너
const Timeline = styled.div`
  position: relative;
  padding-left: 60px; // 충분한 공간을 확보합니다.
`;

// 각 Timeline 항목을 스타일링
const TimelineItem = styled.div`
  position: relative;
  //padding-bottom: 100px; // 아이템 사이의 거리를 조정합니다.
  height: 150px;

  // TimelineItem이 아닌 마지막 자식 요소일 경우 선을 그리지 않습니다.
  &::after {
    content: "";
    position: absolute;
    left: 0px; // 선 중앙에 위치시킵니다.
    top: 10px; // 원 바닥부터 선 시작
    height: calc(100% - 10px); // 마지막 원을 제외한 높이
    width: 2px;
    background: #3f51b5;
    z-index: 0;
  }
`;

// 원을 스타일링
const OriginCircle = styled.div`
  position: absolute;
  left: -7px; // 선 중앙에 맞춤
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #3f51b5;
  border: 3px solid white;
  z-index: 1;
`;

// 원을 스타일링
const DestinationCircle = styled.div`
  position: absolute;
  left: -7px; // 선 중앙에 맞춤
  top: 150px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #53b53f;
  border: 3px solid white;
  z-index: 1;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 0.9em;
  color: #000000;
  margin-left: 30px;
`;

const Destination = styled.h3`
  position: absolute;
  top: 150px;
  margin: 0;
  font-size: 0.9em;
  color: #000000;
  margin-left: 30px;
`;

// 대중교통 이미지와 소요시간을 스타일링
const TransportIcon = styled.div`
  position: absolute;
  left: -53px; // 선의 왼쪽 중앙에 위치
  top: 70%;
  transform: translateY(-100%); // 이미지를 세로 중앙에 맞춤
  width: 30px;
  height: 30px;
  background-image: url("${(props) => props.src}");
  background-size: cover;
  background-position: center;
`;

const Duration = styled.span`
  position: absolute;
  left: -50px; // 선의 왼쪽 중앙에 위치
  top: 70%; // 이미지 바로 아래
  font-size: 0.8em;
  color: #555;
  white-space: nowrap;
`;

// 대중교통 번호 표시를 위한 라운드 렉트 컴포넌트
const InfoTag = styled.div`
  position: absolute;
  left: 25px; // 아이콘의 오른쪽에 위치
  top: 60%; // 수직 중앙 정렬
  transform: translateY(-50%); // 수직 중앙 정렬 보정
  background-color: #53b53f; // 초록색 배경
  color: white; // 흰색 글씨
  border-radius: 10px; // 모서리 둥글게
  padding: 5px 10px; // 내부 여백
  font-size: 0.8em; // 글자 크기
  font-weight: bold; // 글자를 굵게
  white-space: nowrap; // 글자 줄바꿈 방지
`;

// 시간, 제목, 설명 텍스트 스타일링
const Time = styled.span`
  display: block;
  font-size: 0.9em;
  color: #333;
  margin-left: 30px;
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.9em;
  margin-left: 30px;
`;

// RouteTimeline 컴포넌트 정의
const RouteTimeline = ({ minCostRoute }) => {
  console.log(minCostRoute);

  return (
    <Timeline>
      {minCostRoute.map((item, index) => (
        <TimelineItem key={index}>
          <OriginCircle />
          <Title>{item.start}</Title>
          <Time>{item.time}</Time>
          <TransportIcon src={`./${item.transport}.png`} />
          <Duration>{item.duration}분</Duration>

          {/* BUS 타입일 경우에만 대중교통 번호 표시 */}
          {item.transport === "BUS" && <InfoTag>{item.info}</InfoTag>}

          <Description>{item.description}</Description>
          <DestinationCircle />
          <Destination> {item.end}</Destination>
        </TimelineItem>
      ))}
    </Timeline>
  );

  return "hi2";
};

export default RouteTimeline;
