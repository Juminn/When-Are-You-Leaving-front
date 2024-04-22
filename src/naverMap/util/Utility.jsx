function formatTime(isoString) {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  //const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export const makeRecommand = (data) => {
  var path = data.pathAndCosts[data.minCostIndex].path;

  // 출발 시간 변환
  const formattedDepartureTime = formatTime(path.departureTime);
  const formattedArrivalTime = formatTime(path.arrivalTime);

  var makedData = `    ${formattedDepartureTime} 출근
    ${formattedArrivalTime} 도착
    경로: `;

  //경로
  path.legs[0].steps.forEach((step) => {
    if (step.type === "WALKING") {
      makedData += `- 걷기(${step.duration}분)`;
    } else {
      var stations = step.stations;
      makedData += ` - ${step.routes[0].name} ${step.type}(${
        step.duration
      }분, ${stations[0].name} ~ ${stations[stations.length - 1].name})`;
    }
  });

  return makedData;
};

// 결과 데이터를 가공하는 함수
export function transformData(data) {
  const { minCostIndex, pathAndCosts } = data;
  const selectedPath = pathAndCosts[minCostIndex].path;
  const steps = selectedPath.legs[0].steps;
  const departureTime = formatTime(selectedPath.departureTime);
  const arrivalTime = formatTime(selectedPath.arrivalTime);

  const transformedSteps = steps.map((step, index) => {
    const { type, duration, stations, routes } = step;
    const transport = type;

    let start, end, method, info;

    

    if (type === "WALKING") {
      //const ways = step.walkpath.summary.ways;
      //start = ways[0].name;
      //end = ways[ways.length - 1].name;
    } else if (type === "BUS") {
      method = routes[0].name;
      start = stations[0].name + " 승차";
      end = stations[stations.length - 1].name + " 하차";
      info = method;
    } else if (type === "SUBWAY") {
      method = routes[0].name;
      start = method + " " + stations[0].name + "역 승차";
      end = method + " " + stations[stations.length - 1].name + "역 하차";
    }

    if (index === 0) {
      start = departureTime + "출발";
    }

    if (index === steps.length - 1) {
      end = arrivalTime + "도착";
    }

    return { transport, duration, start, end, info };
  });

  return transformedSteps;
}

export default formatTime;
