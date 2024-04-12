import React, { useEffect, useState } from "react";
import styled from "styled-components";

const StyledToggleButton = styled.button`
  position: absolute;
  top: 50vh;
  height: 5vh;
  left: ${({ left }) => left};
  z-index: 10;
  cursor: pointer;
`;

const LeftPannelToggleButton = ({ panelRef, isOpen, onClick }) => {
  const [buttonPosition, setButtonPosition] = useState("0px");

  //토글버튼을 판넬위치에 맞춰 위치조정
  useEffect(() => {
    const currentPanel = panelRef.current;

    const resizeObserver = new ResizeObserver(() => {
      const width = currentPanel ? currentPanel.offsetWidth : 0;
      setButtonPosition(`${width}px`);
    });

    if (currentPanel) {
      resizeObserver.observe(currentPanel);
    }

    return () => {
      if (currentPanel) {
        resizeObserver.unobserve(currentPanel);
      }
    };
  }, [panelRef]); // panelRef를 의존성 배열에 추가합니다.

  return (
    <StyledToggleButton left={buttonPosition} onClick={onClick}>
      {isOpen ? "<" : ">"}
    </StyledToggleButton>
  );
};

export default LeftPannelToggleButton;
