// TimeRangeInput.js
import React from "react";
import styled from "styled-components";

const TimeRangeContainer = styled.div`
  //display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0px;
  margin-top: 20px;
  /* padding: 10px;
  position: relative;
  top: 710px;
  left: 10px;
  z-index: 10; */
`;

const SettingField = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const TimeInput = styled.input`
  padding: 10px 20px;
  border-radius: 6px;
  border: 2px solid #ccc;
  margin: 0 5px;
`;

const TimeRangeInput = ({
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  showDetails,
  setShowDetails,
}) => {
  return (
    <TimeRangeContainer>
      <SettingField>
        <Label>출발 가능한 시간 범위</Label>
        <TimeInput
          id="startTime"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        ~
        <TimeInput
          id="endTime"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </SettingField>
      {/* <button onClick={() => setShowDetails(!showDetails)}>상세 설정</button> */}
    </TimeRangeContainer>
  );
};

export default TimeRangeInput;
