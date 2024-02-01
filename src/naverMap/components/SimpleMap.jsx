import React, { useEffect } from 'react';

const SimpleMap = () => {
    useEffect(() => {
        // Naver Maps 스크립트 로드
        const script = document.createElement('script');
        script.src = "https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=wdgsiykfpc&submodules=panorama";
        script.async = true;
        document.head.appendChild(script);

        // 스크립트 로드 완료 후 맵 초기화
        script.onload = () => {
            var mapOptions = {
                center: new window.naver.maps.LatLng(37.3595704, 127.105399),
                zoom: 10
            };
            //var map = 
            new window.naver.maps.Map('map', mapOptions);
        };

        // 컴포넌트 언마운트 시 스크립트 제거
        return () => {
            document.head.removeChild(script);
        };
    }, []);

    return <div id="map" style={{ width: '100%', height: '600px' }}></div>;
};

export default SimpleMap;