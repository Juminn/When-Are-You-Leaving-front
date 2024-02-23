import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

const AddressMap = () => {
  const [address, setAddress] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:30");
  const [costServerData, setCostServerData] = useState("");
  const [recommand, setRecommand] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const [opportunityCost, setOpportunityCost] = useState("14000");
  const [subwayCost, setSubwayCost] = useState("10000");
  const [busCost, setBusCost] = useState("14000");
  const [walkingCost, setWalkingCost] = useState("20000");

  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const mapRef = useRef(null);
  const contextMenuWindowRef = useRef(null);

  const startMarkerRef = useRef(null);
  const endMarkerRef = useRef(null);

  const naver = window.naver;

  //네이버지도 초기화
  useEffect(() => {
    // 지도 초기화
    const initMap = () => {
      const mapOptions = {
        center: new naver.maps.LatLng(37.3595316, 127.1052133),
        zoom: 15,
        mapTypeControl: true,
      };

      mapRef.current = new naver.maps.Map("map", mapOptions);

      contextMenuWindowRef.current = new naver.maps.InfoWindow({
        disableAnchor: true,
        pixelOffset: new naver.maps.Point(+61, 0),
      });

      mapRef.current.setCursor("pointer");
    };

    initMap();

    // 클린업 함수: 컴포넌트 언마운트 시 리소스 정리
    return () => {
      if (contextMenuWindowRef.current) {
        mapRef.current.destroy();
      }

      if (startMarkerRef.current) {
        startMarkerRef.current = null;
      }

      if (endMarkerRef.current) {
        endMarkerRef.current = null;
        //endMarkerRef.current.setMap(null);
      }
    };
  }, []);

  //지도 클릭 리스너추가
  useEffect(() => {
    const rightClick = naver.maps.Event.addListener(
      mapRef.current,
      "rightclick",
      function (e) {
        console.log("rightClick, 좌표: ", e.coord);
        searchCoordinateToAddress(e.coord);
      }
    );

    return () => {
      if (contextMenuWindowRef.current) {
        contextMenuWindowRef.current.close();
      }

      // 우클릭 이벤트 리스너를 제거합니다.
      naver.maps.Event.removeListener(rightClick);
    };
  }, [startTime, endTime, opportunityCost, subwayCost, busCost, walkingCost]);

  //핸들러
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchAddressToCoordinate(address);
    }
  };

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

  //주소로 좌표찾고 이동
  function searchAddressToCoordinate(address) {
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

        var htmlAddresses = [],
          item = response.v2.addresses[0],
          point = new naver.maps.LatLng(item.y, item.x);

        if (item.roadAddress) {
          htmlAddresses.push("[도로명 주소] " + item.roadAddress);
        }

        if (item.jibunAddress) {
          htmlAddresses.push("[지번 주소] " + item.jibunAddress);
        }

        if (item.englishAddress) {
          htmlAddresses.push("[영문명 주소] " + item.englishAddress);
        }

        contextMenuWindowRef.current.setContent(
          [
            '<div style="padding:10px;min-width:200px;line-height:150%;">',
            '<h4 style="margin-top:5px;">검색 주소 : ' +
              address +
              "</h4><br />",
            htmlAddresses.join("<br />"),
            "</div>",
          ].join("\n")
        );

        console.log("searchAddressToCoordinate, response: ", response);
        console.log("searchAddressToCoordinate, point: ", point);

        mapRef.current.setCenter(point);
        searchCoordinateToAddress(point);
        //contextMenuWindowRef.current.open(mapRef.current, point);
      }
    );
  }

  //최소비용 경로와 시간 요청
  const requestMinCostRoute = () => {
    if (startMarkerRef.current != null && endMarkerRef.current != null) {
      setShowResult(true);
      setIsLoading(true);

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
            `opportunityCost=${opportunityCost}&` +
            `subwayCost=${subwayCost}&` +
            `busCost=${busCost}&` +
            `walkingCost=${walkingCost}`
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
            "서버가 불안정합니다. 새로고침 후 다시 시도 해주세요. Error:" +
              error.message
          ); // 오류 처리
        });
    }
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

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  // 상세 설정 표시 상태를 토글하는 함수
  const toggleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleOpportunityCostChange = (e) => {
    setOpportunityCost(e.target.value);
  };
  const handleSubwayCostChange = (e) => {
    setSubwayCost(e.target.value);
  };
  const handleBusCostChange = (e) => {
    setBusCost(e.target.value);
  };
  const handleWalkingCostChange = (e) => {
    setWalkingCost(e.target.value);
  };

  //
  function formatTime(isoString) {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}시 ${minutes}분 ${seconds}초`;
  }

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "700px" }}></div>
      <input
        style={{
          padding: "10px 20px", // 안쪽 여백
          borderRadius: "4px", // 모서리 둥글기
          position: "absolute", // 절대 위치
          top: "10px", // 상단에서 10px 떨어진 위치
          left: "10px", // 왼쪽에서 10px 떨어진 위치
          zIndex: 10, // 쌓임 순서
        }}
        type="text"
        value={address}
        onChange={handleAddressChange}
        onKeyPress={handleKeyPress}
      />

      {/* 시간 범위 컨테이너 */}
      <div
        style={{
          display: "flex", // flexbox를 사용하여 아이템을 수평 정렬
          alignItems: "center", // 아이템을 세로 방향으로 가운데 정렬
          padding: "10px", // 컨테이너의 안쪽 여백
          zIndex: 10, // 쌓임 순서
          position: "absolute", // 절대 위치
          top: "710px", // 상단에서 10px 떨어진 위치
          left: "10px", // 왼쪽에서 10px 떨어진 위치
        }}
      >
        {/* 시간 범위 텍스트 */}
        <h1 style={{ margin: "0 10px 0 0" }}>시간 범위 입력:</h1>

        <input
          style={{
            padding: "10px 20px", // 안쪽 여백
            borderRadius: "4px", // 모서리 둥글기
            zIndex: 10, // 쌓임 순서
          }}
          type="text"
          value={startTime}
          onChange={handleStartTimeChange}
        />

        <span>~</span>

        <input
          style={{
            padding: "10px 20px", // 안쪽 여백
            borderRadius: "4px", // 모서리 둥글기
            zIndex: 10, // 쌓임 순서
          }}
          type="text"
          value={endTime}
          onChange={handleEndTimeChange}
        />

        {/* 상세 설정 버튼 */}
        <button
          style={{
            padding: "10px 20px",
            margin: "10px",
            borderRadius: "4px",
            zIndex: 10,
          }}
          onClick={toggleShowDetails}
        >
          상세 설정
        </button>
      </div>

      <div
        style={{
          position: "absolute", // 절대 위치
          top: "800px", // "시간 범위" 컨테이너 아래 위치
          left: "10px", // 왼쪽에서 10px 떨어진 위치
          width: "100%", // 전체 너비
          padding: "10px", // 안쪽 여백
          zIndex: 10, // 쌓임 순서
        }}
      >
        {/* 상세 설정 입력 필드 */}
        {showDetails && (
          <div
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: "#f9f9f9",
              zIndex: 10,
            }}
          >
            <h2>대중교통 별 시간당 비용 입력</h2>
            <div>
              <label>기회 비용(시급): </label>
              <input
                type="number"
                placeholder="기회 비용(시급) 입력"
                value={opportunityCost}
                onChange={handleOpportunityCostChange}
              />
            </div>
            <div>
              <label>버스 비용: </label>
              <input
                type="number"
                placeholder="버스 비용 입력"
                value={busCost}
                onChange={handleBusCostChange}
              />
            </div>
            <div>
              <label>지하철 비용: </label>
              <input
                type="number"
                placeholder="지하철 비용 입력"
                value={subwayCost}
                onChange={handleSubwayCostChange}
              />
            </div>
            <div>
              <label>걷기 비용: </label>
              <input
                type="number"
                placeholder="걷기 비용 입력"
                value={walkingCost}
                onChange={handleWalkingCostChange}
              />
            </div>
            {/* 필요에 따라 추가 교통수단 입력 필드 추가 */}
          </div>
        )}
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
      </div>
    </div>
  );
};

export default AddressMap;
