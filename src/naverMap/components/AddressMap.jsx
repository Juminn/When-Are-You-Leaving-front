import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

const AddressMap = () => {
  //const [map, setMap] = useState(null);
  //const [infoWindowRef.current, setInfoWindowRef] = useState(null);
  const [address, setAddress] = useState("");
  const [cost, setCost] = useState("");

  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);
  //const markerListRef = useRef(null);

  const naver = window.naver;

  useEffect(() => {
    const navermaps = window.naver.maps;

    // 지도 초기화
    const initMap = () => {
      const mapOptions = {
        center: new navermaps.LatLng(37.3595316, 127.1052133),
        zoom: 15,
        mapTypeControl: true,
      };

      mapRef.current = new navermaps.Map("map", mapOptions);
      //setMap(map);

      infoWindowRef.current = new navermaps.InfoWindow({
        disableAnchor: true,
        pixelOffset: new naver.maps.Point(+61, 0),
        //anchorColor: "#ff0",
      });
      //setInfoWindowRef(infoWindowRef.current);

      mapRef.current.setCursor("pointer");

      mapRef.current.addListener("rightclick", function (e) {
        //console.log(infoWindowRef.current);
        console.log(e.coord);
        searchCoordinateToAddress(e.coord);
      });
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
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }

      // 모든 이벤트 리스너를 제거합니다.
      navermaps.Event.clearListeners(mapRef.current, "click");
      // 추가적으로 설정된 리스너가 있다면, 여기에서 clearListeners를 호출합니다.
    };
  }, []);

  // 나머지 함수들(searchCoordinateToAddress, searchAddressToCoordinate 등)은 여기에 정의...
  const handleAddressChange = (e) => {
    console.log(infoWindowRef.current);
    setAddress(e.target.value);
  };

  const handleSearch = (e) => {
    console.log(infoWindowRef.current);
    e.preventDefault();
    searchAddressToCoordinate(address);
  };

  const handleKeyPress = (e) => {
    console.log(infoWindowRef.current);
    if (e.key === "Enter") {
      searchAddressToCoordinate(address);
    }
  };

  //중요함수 가져오기
  function searchCoordinateToAddress(latlng) {
    infoWindowRef.current.close();

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

        infoWindowRef.current.setContent(
          [
            '<div style="padding:10px;min-width:100px;line-height:150%;">',
            // '<h4 style="margin-top:5px;">검색 좌표</h4><br />',
            // htmlAddresses.join("<br />"),
            '   <button id="startButton" >출발</button>',
            '   <button id="endButton" >도착</button>',
            "</div>",
          ].join("\n")
        );

        infoWindowRef.current.open(mapRef.current, latlng);

        //버튼에 이벤트 리스너를 등록합니다.

        const startButton = document.getElementById("startButton");
        const endButton = document.getElementById("endButton");

        if (startButton) {
          startButton.addEventListener("click", () => {
            console.log(startButton);
            // 필요한 추가 작업을 여기에 구현하세요.
            const marker = new naver.maps.Marker({
              position: latlng,
              map: mapRef.current,
              icon: "./출발test.png",
            });
            infoWindowRef.current.close();
          });
        }

        if (endButton) {
          endButton.addEventListener("click", () => {
            console.log(endButton);
            // 필요한 추가 작업을 여기에 구현하세요.
            const marker = new naver.maps.Marker({
              position: latlng,
              map: mapRef.current,
              icon: "./도착test.png",
            });
            infoWindowRef.current.close();
            alert(latlng);

            //서버에요청
            axios
              .get(
                "http://localhost:8080/a?startX=126.73706789999993&startY=37.54487940000018&goalX=126.79758700000022&goalY=37.546016099999925&startTime=2023-09-18T18:00:00&endTime=2023-09-18T19:00:00"
              )
              .then((response) => {
                setCost(response.data);
                console.log(response.data); // 데이터 처리
              })
              .catch((error) => {
                console.error("Error:", error); // 오류 처리
              });
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

        infoWindowRef.current.setContent(
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
        infoWindowRef.current.open(mapRef.current, point);
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
  const handleAddressChange2 = (e) => {
    console.log(infoWindowRef.current);
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
      <div id="map" style={{ width: "100%", height: "800px" }}></div>
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
      <button onClick={handleSearch}>Search</button>
      <div style={{ width: "100%", height: "100px" }}>hi</div>
      <div>
        <h1>서버로부터 받은 데이터</h1>

        <pre>{JSON.stringify(cost, null, 2)}</pre>
      </div>
    </div>
  );
};

export default AddressMap;
