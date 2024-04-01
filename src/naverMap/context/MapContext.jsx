import React, { createContext, useContext, useRef, useState } from "react";

const MapContext = createContext();

export const useMap = () => useContext(MapContext);

export const MapProvider = ({ children }) => {
  const mapRef = useRef(null);
  const startMarkerRef = useRef(null);
  const endMarkerRef = useRef(null);
  const contextMenuWindowRef = useRef(null);

  // 여기에 다른 지도 관련 상태와 함수를 추가할 수 있습니다.
  const searchAddressToCoordinate = async (address) => {
    // 주소를 좌표로 변환하는 함수 구현
  };

  const searchCoordinateToAddress = async (latLng) => {
    // 좌표를 주소로 변환하는 함수 구현
  };

  // 기타 지도 관련 함수와 상태를 여기에 추가

  return (
    <MapContext.Provider
      value={{
        mapRef,
        startMarkerRef,
        endMarkerRef,
        contextMenuWindowRef,

        // 추가된 상태와 함수를 여기에 포함
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
