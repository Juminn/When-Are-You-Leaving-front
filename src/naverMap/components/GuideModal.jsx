import React, { useState } from "react";
import Modal from "react-modal";

// 모달의 스타일을 지정할 수 있습니다.
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    zIndex: 0,
    maxWidth: "80vw",
    maxHeight: "60vh",
  },
  overlay: {
    zIndex: 10, // 모달 배경에 적용될 z-index 값
  },
};

// 모달을 앱의 루트 엘리먼트에 바인딩합니다(선택적).
Modal.setAppElement("#root");

function CustomModal() {
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const howTo = `
  이 서비스는 사용자가 출도착지, 출근 가능한 시간 범위, 대중교통별 기회비용을 입력하면 최적의 출근시간과 
  출근 루트를 추천해줍니다.
  
  1. 출도착지 설정법
    지도의 검색창에서 도로명 주소 검색을 하거나, 지도에서 마우스 우클릭 후 출도착지를 설정한다.
  
  2. 출근 가능한 시간범위 입력
     시작시간과 종료시간을 입력한다.
  
  (선택사항) 
  3. 대중교통별 기회비용 입력
    상세설정 버튼을 눌러 각 대중교통별 기회비용을 입력한다.
    기본값으로 대중적인 대중교통 선호도와 소득 중위값을 사용한다.
        1. 대중교통 선호도: 지하철>버스>걷기 
        2. 시간당 소득 중위값: 14000원
    `;

  return (
    <div>
      <button onClick={openModal}>사용법</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="사용법 모달"
      >
        <h2>사용법 안내</h2>
        <pre>{howTo}</pre>
        <p>
          상세설명:{" "}
          <a
            href="https://github.com/Juminn/When-to-go-front"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub 페이지
          </a>
        </p>
        <button onClick={closeModal}>닫기</button>
      </Modal>
    </div>
  );
}

export default CustomModal;
