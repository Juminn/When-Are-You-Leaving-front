function formatTime(isoString) {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  //const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hours}시 ${minutes}분`;
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

export default formatTime;
