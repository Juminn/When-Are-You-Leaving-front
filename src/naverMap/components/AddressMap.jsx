import React, { useRef, useState } from "react";
import AddressInput from "./AddressInput";
import TimeRangeInput from "./TimeRangeInput";
import DetailSettings from "./DetailSettings";

import styled from "styled-components";

import {
  makeRecommand,
  transformData as transformMinCostRoute,
} from "../util/Utility";
import { useMap } from "../hooks/useMap";
import { minCostRouteRequestApi } from "../services/CostCalApi";
import CustomModal from "./GuideModal";
import RouteResult from "./RouteResult";
import LeftPannelToggleButton from "./LeftPannelToggleButton";
import RouteTimeline from "./RouteTimeline";

// const MapPageContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;

//   position: relative;
//   top: 10px;
//   left: 10px;
//   gap: 20px;
//   z-index: 0;
// `;

const PageLayout = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const LeftPanel = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  //min-width: ${({ isOpen }) => (isOpen ? "30vw" : "0")};
  width: ${({ isOpen }) => (isOpen ? "auto" : "0")};
  background: white; // 배경색 추가
  overflow-x: scroll; // 내용이 넘칠 경우 스크롤
  transition: width 0.3s ease-out;
  z-index: 5; // 지도 위에 오도록 z-index 설정

  padding-left: ${({ isOpen }) => (isOpen ? "1vw" : "0")}; // 왼쪽 여백 추가
  padding-right: ${({ isOpen }) => (isOpen ? "1vw" : "0")}; // 왼쪽 여백 추가

  border-right: 2px solid #ccc; /* 오른쪽 경계선 추가 */
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const AddressMap = () => {
  const [address, setAddress] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:30");
  const [costServerData, setCostServerData] = useState("");
  const [minCostRoute, setMinCostRoute] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  const [settings, setSettings] = useState({
    opportunityCost: "14000",
    subwayCost: "10000",
    busCost: "14000",
    walkingCost: "20000",
  });

  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isPanelOpen, setIsPanelOpen] = useState(true); // 패널 상태 관리를 위한 상태

  // 레프트 패널의 Ref를 생성합니다.
  const leftPanelRef = useRef();

  // 패널 토글 함수
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const naver = window.naver;
  const contextMenuHtml = [
    '<div style="padding:10px;min-width:100px;line-height:150%;">',
    '   <button id="startButton" >출발</button>',
    '   <button id="endButton" >도착</button>',
    "</div>",
  ].join("\n");

  //네이버지도 초기화, 지도 context menu추가
  const { mapRef, startMarkerRef, endMarkerRef, contextMenuWindowRef } = useMap(
    createAndShowMapContextMenu,
    startTime,
    endTime,
    settings
  );

  //지도 우클릭 메뉴 만들기/보여주기
  function createAndShowMapContextMenu(latlng) {
    //메뉴를 보여주기
    contextMenuWindowRef.current.setContent(contextMenuHtml);
    contextMenuWindowRef.current.open(mapRef.current, latlng);

    //메뉴의 버튼 만들기
    const startButton = document.getElementById("startButton");
    const endButton = document.getElementById("endButton");
    if (startButton) {
      startButton.addEventListener("click", () =>
        addMarkerAndRequestRoute(startMarkerRef, "./출발test.png", latlng)
      );
    }
    if (endButton) {
      endButton.addEventListener("click", () =>
        addMarkerAndRequestRoute(endMarkerRef, "./도착test.png", latlng)
      );
    }
  }

  // 마커를 추가하고 서버에 최소 경로를 요청하는 함수
  async function addMarkerAndRequestRoute(markerRef, iconPath, latlng) {
    contextMenuWindowRef.current.close();

    if (markerRef.current != null) {
      markerRef.current.setMap(null);
    }

    const marker = new naver.maps.Marker({
      position: latlng,
      map: mapRef.current,
      icon: iconPath,
    });

    markerRef.current = marker;

    //출도착지 모두 지정된 경우
    if (startMarkerRef.current != null && endMarkerRef.current != null) {
      //서버에요청
      setIsLoading(true);
      setShowResult(true);
      const response = await requestMinCostRoute();

      if (response === null) {
        return;
      }
      //형태변환
      //const makedData = makeRecommand(response);
      const transFormedMinCostRoute = transformMinCostRoute(response);
      //결과출력
      //setRecommand(makedData);
      setMinCostRoute(transFormedMinCostRoute);
      //setCostServerData(transFormedMinCostRoute);

      setIsLoading(false);
    }
  }

  //주소로 좌표찾고 이동 후 메뉴표시
  function searchAddressToCoordinate(address) {
    const naver = window.naver;

    naver.maps.Service.geocode(
      {
        query: address,
      },
      function (status, response) {
        if (status === naver.maps.Service.Status.ERROR) {
          return alert("Something Wrong!");
        }

        if (response.v2.meta.totalCount === 0) {
          return alert(
            "지역 명이나 도로명 주소를 입력해주세요\n" +
              "ex) 인천, 부개동, 새벌로133번길21 "
          );
        }

        const address = response.v2.addresses[0];
        const point = new naver.maps.LatLng(address.y, address.x);

        console.log("searchAddressToCoordinate, point: ", point);

        mapRef.current.setCenter(point);
        createAndShowMapContextMenu(point);
      }
    );
  }

  //최소비용 경로와 시간 요청
  const requestMinCostRoute = async () => {
    //전처리
    if (startMarkerRef.current == null || endMarkerRef.current == null) {
      return;
    }
    if (startTime > endTime) {
      alert("종료시간이 시작시간보다 빠를 수 없습니다. ");
      return;
    }

    //로직시작

    const response = await minCostRouteRequestApi(
      startMarkerRef.current.getPosition().lng(),
      startMarkerRef.current.getPosition().lat(),
      endMarkerRef.current.getPosition().lng(),
      endMarkerRef.current.getPosition().lat(),
      "2024-02-05T" + startTime,
      "2024-02-05T" + endTime,
      settings.opportunityCost,
      settings.subwayCost,
      settings.busCost,
      settings.walkingCost
    );

    console.log(response); // 데이터 처리
    setCostServerData(response);

    return response;
  };

  return (
    <PageLayout>
      <LeftPanel isOpen={isPanelOpen} ref={leftPanelRef}>
        <AddressInput
          address={address}
          setAddress={setAddress}
          onSearch={searchAddressToCoordinate}
        />

        <CustomModal />
        <TimeRangeInput
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          showDetails={showDetails}
          setShowDetails={setShowDetails}
        />

        <DetailSettings
          show={showDetails ? "true" : undefined}
          settings={settings}
          setSettings={setSettings}
        />

        <RouteTimeline minCostRoute={minCostRoute} />

        {showResult && (
          <RouteResult
            isLoading={isLoading}
            recommand={minCostRoute}
            costServerData={costServerData}
          />
        )}
      </LeftPanel>

      <MapContainer>
        <div id="map" style={{ width: "100%", height: "100vh" }}></div>
      </MapContainer>

      <LeftPannelToggleButton
        panelRef={leftPanelRef}
        isOpen={isPanelOpen}
        onClick={togglePanel}
      />
    </PageLayout>
  );
};

export default AddressMap;
