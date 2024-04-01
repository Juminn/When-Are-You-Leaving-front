import axios from "axios";
import React, { useState } from "react";
import AddressInput from "./AddressInput";
import TimeRangeInput from "./TimeRangeInput";
import DetailSettings from "./DetailSettings";

import styled from "styled-components";

import formatTime from "../util/Utility";
import { useMap } from "../hooks/useMap";
import { minCostRouteRequestApi } from "../services/CostCalApi";
import CustomModal from "../CustomModal";

const MapPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  position: relative;
  top: 10px;
  left: 10px;
  gap: 20px;
  z-index: 0;
`;
//
const AddressMap = () => {
  const [address, setAddress] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:30");
  const [costServerData, setCostServerData] = useState("");
  const [recommand, setRecommand] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const [settings, setSettings] = useState({
    opportunityCost: "14000",
    subwayCost: "10000",
    busCost: "14000",
    walkingCost: "20000",
  });

  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const naver = window.naver;

  //네이버지도 초기화, 지도 context menu추가
  const { mapRef, startMarkerRef, endMarkerRef, contextMenuWindowRef } = useMap(
    searchCoordinateToAddress,
    startTime,
    endTime,
    settings
  );

  //우클릭 메뉴만들기 - 함수 내부를 쪼개는게 좋을듯
  function searchCoordinateToAddress(latlng) {
    contextMenuWindowRef.current.setContent(
      [
        '<div style="padding:10px;min-width:100px;line-height:150%;">',
        '   <button id="startButton" >출발</button>',
        '   <button id="endButton" >도착</button>',
        "</div>",
      ].join("\n")
    );
    contextMenuWindowRef.current.open(mapRef.current, latlng);

    //버튼에 이벤트 리스너를 등록합니다.
    const startButton = document.getElementById("startButton");
    const endButton = document.getElementById("endButton");

    if (startButton) {
      startButton.addEventListener("click", () => {
        contextMenuWindowRef.current.close();

        if (startMarkerRef.current != null) {
          startMarkerRef.current.setMap(null);
        }

        const marker = new naver.maps.Marker({
          position: latlng,
          map: mapRef.current,
          icon: "./출발test.png",
        });

        startMarkerRef.current = marker;
        console.log("marker: ", marker);

        //서버에요청
        requestMinCostRoute();
      });
    }

    if (endButton) {
      endButton.addEventListener("click", () => {
        contextMenuWindowRef.current.close();

        if (endMarkerRef.current != null) {
          endMarkerRef.current.setMap(null);
        }

        const marker = new naver.maps.Marker({
          position: latlng,
          map: mapRef.current,
          icon: "./도착test.png",
        });

        endMarkerRef.current = marker;

        //서버에요청
        requestMinCostRoute();
      });
    }
  }

  //주소로 좌표찾고 이동 후 버튼표시
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
        searchCoordinateToAddress(point);
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

    //로직시작s
    setShowResult(true);
    setIsLoading(true);

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
    makeRecommand(response);

    setIsLoading(false);

    /*
    const apiUrl = process.env.REACT_APP_API_ENDPOINT;

    axios
      .get(
        `${apiUrl}/a?` +
          `startX=${startMarkerRef.current.getPosition().lng()}&` +
          `startY=${startMarkerRef.current.getPosition().lat()}&` +
          `goalX=${endMarkerRef.current.getPosition().lng()}&` +
          `goalY=${endMarkerRef.current.getPosition().lat()}&` +
          `startTime=2024-02-05T${startTime}&` +
          `endTime=2024-02-05T${endTime}&` +
          `opportunityCost=${settings.opportunityCost}&` +
          `subwayCost=${settings.subwayCost}&` +
          `busCost=${settings.busCost}&` +
          `walkingCost=${settings.walkingCost}`
      )
      .then((response) => {
        setCostServerData(response.data);
        makeRecommand(response.data);
        console.log(response.data); // 데이터 처리

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(
          "서버 요청에 실패했습니다. 새로고침 후 다시 시도해주세요. Error:" +
            error.message
        ); // 오류 처리
      });
      */
  };

  const makeRecommand = (data) => {
    var path = data.pathAndCosts[data.minCostIndex].path;

    // 출발 시간 변환
    const formattedDepartureTime = formatTime(path.departureTime);
    const formattedArrivalTime = formatTime(path.arrivalTime);

    var makedData = `추천시간
      출발시간: ${formattedDepartureTime}
      도착시간: ${formattedArrivalTime}
      요약: `;

    //경로
    path.legs[0].steps.forEach((step) => {
      if (step.type === "WALKING") {
        //var ways = step.walkpath.summary.ways;
        //makedData += ways[ways.length - 1];
        makedData += `- 걷기(${step.duration}분)`;
      } else {
        var stations = step.stations;
        makedData += ` - ${step.routes[0].name} ${step.type}(${
          step.duration
        }분, ${stations[0].name} ~ ${stations[stations.length - 1].name})`;

        // makedData += ` - ${stations[0].name}에서 탑승 ${
        //   stations[stations.length - 1].name
        // }에서 하차/`;
      }
    });

    setRecommand(makedData);
  };

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "700px" }}></div>
      <AddressInput
        address={address}
        setAddress={setAddress}
        onSearch={searchAddressToCoordinate}
      />

      <CustomModal />
      <MapPageContainer>
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

        {showResult &&
          (isLoading ? (
            <h2> 계산중..... </h2>
          ) : (
            <div>
              <h2>추천 시간 출력</h2>
              <pre style={{ fontSize: "20px" }}>{recommand}</pre>

              <h1>서버로부터 받은 데이터</h1>
              <pre>{JSON.stringify(costServerData, null, 2)}</pre>
            </div>
          ))}
      </MapPageContainer>
    </div>
  );
};

export default AddressMap;
