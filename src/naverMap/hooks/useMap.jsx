import { useCallback, useEffect, useRef } from "react";

export const useMap = (
  createAndShowMapContextMenu,
  startTime,
  endTime,
  settings
) => {
  const mapRef = useRef(null);
  const startMarkerRef = useRef(null);
  const endMarkerRef = useRef(null);
  const contextMenuWindowRef = useRef(null);

  const naver = window.naver;

  //지도 초기화
  const initMap = useCallback(
    () => {
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
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
  }, [initMap]);

  //지도 클릭 리스너추가
  useEffect(() => {
    const rightClick = naver.maps.Event.addListener(
      mapRef.current,
      "rightclick",
      function (e) {
        console.log("rightClick, 좌표: ", e.coord);
        createAndShowMapContextMenu(e.coord);
      }
    );

    let longPressTimer;

    const handleTouchStart = (e) => {
      longPressTimer = setTimeout(() => {
        // 길게 누르기 이벤트를 처리합니다. `e.coord`는 실제 구현에 맞게 조정해야 할 수 있습니다.
        console.log("Long press, 좌표: ", e.coord);
        createAndShowMapContextMenu(e.coord);
      }, 600); // 800ms 이상 누르면 길게 누르기로 간주
    };

    const handleTouchEnd = () => {
      clearTimeout(longPressTimer); // 터치가 끝나면 타이머를 취소합니다.
    };

    // 모바일 환경에서는 touchstart와 touchend 이벤트 리스너를 추가합니다.
    naver.maps.Event.addListener(
      mapRef.current,
      "touchstart",
      handleTouchStart
    );
    naver.maps.Event.addListener(mapRef.current, "touchend", handleTouchEnd);

    return () => {
      if (contextMenuWindowRef.current) {
        contextMenuWindowRef.current.close();
      }

      // 우클릭 이벤트 리스너를 제거합니다.
      naver.maps.Event.removeListener(rightClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime, settings]);

  return { mapRef, startMarkerRef, endMarkerRef, contextMenuWindowRef };
};
