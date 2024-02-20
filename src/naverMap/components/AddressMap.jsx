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
  //const navermaps = window.naver.maps;

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
      //setMap(map);

      contextMenuWindowRef.current = new naver.maps.InfoWindow({
        disableAnchor: true,
        pixelOffset: new naver.maps.Point(+61, 0),
        //anchorColor: "#ff0",
      });

      mapRef.current.setCursor("pointer");

      //
      //   naver.maps.Event.addListener(mapRef.current, "click", function (e) {
      //     const marker = new naver.maps.Marker({
      //       position: e.coord,
      //       map: mapRef.current,
      //     });
      //   });
    };

    initMap();

    // 클린업 함수: 컴포넌트 언마운트 시 리소스 정리
    return () => {
      if (contextMenuWindowRef.current) {
        contextMenuWindowRef.current.close();
      }

      // 모든 이벤트 리스너를 제거합니다.
      //naver.maps.Event.clearListeners(mapRef.current, "click");
      // 추가적으로 설정된 리스너가 있다면, 여기에서 clearListeners를 호출합니다.
    };
  }, []);

  //지도 클릭 리스너추가
  useEffect(() => {
    const rightClick = naver.maps.Event.addListener(
      mapRef.current,
      "rightclick",
      function (e) {
        console.log("rightClick");
        searchCoordinateToAddress(e.coord);
      }
    );

    return () => {
      if (contextMenuWindowRef.current) {
        contextMenuWindowRef.current.close();
      }

      // 모든 이벤트 리스너를 제거합니다.
      //naver.maps.Event.clearInstanceListeners(mapRef.current);
      naver.maps.Event.removeListener(rightClick);
      // 추가적으로 설정된 리스너가 있다면, 여기에서 clearListeners를 호출합니다.
    };
  }, [startTime, endTime, opportunityCost, subwayCost, busCost, walkingCost]);

  // 나머지 함수들(searchCoordinateToAddress, searchAddressToCoordinate 등)은 여기에 정의...
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchAddressToCoordinate(address);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchAddressToCoordinate(address);
    }
  };

  //중요함수 가져오기
  function searchCoordinateToAddress(latlng) {
    //infoWindowRef.current.close();

    naver.maps.Service.reverseGeocode(
      {
        coords: latlng,
        orders: [
          naver.maps.Service.OrderType.ADDR,
          naver.maps.Service.OrderType.ROAD_ADDR,
        ].join(","),
      },
      function (status, response) {
        if (status === naver.maps.Service.Status.ERROR) {
          return alert("Something Wrong!");
        }

        var items = response.v2.results,
          address = "",
          htmlAddresses = [];

        for (var i = 0, ii = items.length, item, addrType; i < ii; i++) {
          item = items[i];
          address = makeAddress(item) || "";
          addrType = item.name === "roadaddr" ? "[도로명 주소]" : "[지번 주소]";

          htmlAddresses.push(i + 1 + ". " + addrType + " " + address);
        }

        contextMenuWindowRef.current.setContent(
          [
            '<div style="padding:10px;min-width:100px;line-height:150%;">',
            // '<h4 style="margin-top:5px;">검색 좌표</h4><br />',
            // htmlAddresses.join("<br />"),
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
    );
  }

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
          return alert("totalCount" + response.v2.meta.totalCount);
        }

        var htmlAddresses = [],
          item = response.v2.addresses[0],
          point = new naver.maps.Point(item.x, item.y);

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

        mapRef.current.setCenter(point);
        contextMenuWindowRef.current.open(mapRef.current, point);
      }
    );
  }

  //남은함수 그대로가져오기
  function makeAddress(item) {
    if (!item) {
      return;
    }

    var name = item.name,
      region = item.region,
      land = item.land,
      isRoadAddress = name === "roadaddr";

    var sido = "",
      sigugun = "",
      dongmyun = "",
      ri = "",
      rest = "";

    if (hasArea(region.area1)) {
      sido = region.area1.name;
    }

    if (hasArea(region.area2)) {
      sigugun = region.area2.name;
    }

    if (hasArea(region.area3)) {
      dongmyun = region.area3.name;
    }

    if (hasArea(region.area4)) {
      ri = region.area4.name;
    }

    if (land) {
      if (hasData(land.number1)) {
        if (hasData(land.type) && land.type === "2") {
          rest += "산";
        }

        rest += land.number1;

        if (hasData(land.number2)) {
          rest += "-" + land.number2;
        }
      }

      if (isRoadAddress === true) {
        if (checkLastString(dongmyun, "면")) {
          ri = land.name;
        } else {
          dongmyun = land.name;
          ri = "";
        }

        if (hasAddition(land.addition0)) {
          rest += " " + land.addition0.value;
        }
      }
    }

    return [sido, sigugun, dongmyun, ri, rest].join(" ");
  }

  function hasArea(area) {
    return !!(area && area.name && area.name !== "");
  }

  function hasData(data) {
    return !!(data && data !== "");
  }

  function checkLastString(word, lastString) {
    return new RegExp(lastString + "$").test(word);
  }

  function hasAddition(addition) {
    return !!(addition && addition.value);
  }

  //내가 추가한 함수들
  const requestMinCostRoute = () => {
    if (startMarkerRef.current != null && endMarkerRef.current != null) {
      setShowResult(true);
      setIsLoading(true);

      axios
        .get(
          `https://api.언제출발해.com/a?` +
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
          alert.error("Error:", error); // 오류 처리
        });
    }
  };

  const makeRecommand = (data) => {
    var path = data.pathAndCosts[data.minCostIndex].path;

    var makedData = `추천시간
      출발시간: ${path.departureTime}
      도착시간: ${path.arrivalTime}
      요약: `;

    //경로
    path.legs[0].steps.forEach((step) => {
      if (step.type === "WALKING") {
        //var ways = step.walkpath.summary.ways;
        //makedData += ways[ways.length - 1];
        makedData += `- 걷기(${step.duration}분)`;
      } else {
        var stations = step.stations;
        makedData += ` - ${step.type}(${step.duration}분, ${
          stations[0].name
        } ~ ${stations[stations.length - 1].name})`;

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

  const handleAddressChange2 = (e) => {
    console.log(contextMenuWindowRef.current);
    setAddress(e.target.value);
  };

  const myHandle = (e) => {
    naver.maps.Marker({
      positon: e.coord,
      map: mapRef.current,
    });
  };

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
              <pre style={{ fontSize: '20px' }}>{recommand}</pre>

              <h1>서버로부터 받은 데이터</h1>
              <pre>{JSON.stringify(costServerData, null, 2)}</pre>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AddressMap;
