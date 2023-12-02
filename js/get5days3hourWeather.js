const getFiveDaysWeather = async (lat, lng) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=226bd39be2fbdc28c43f2034849aecab&units=metric`
  );
  const data = await response.json();
  const array = data.list;
  const divideArray = (array, groupSize) => {
    const groups = [];
    for (let i = 0; i < array.length; i += groupSize) {
      groups.push(array.slice(i, i + groupSize));
    }
    return groups;
  };
  const groups = divideArray(array, 8);
  const myObject = {};
  for (let i = 0; i < groups.length; i++) {
    myObject[`day${i + 1}`] = groups[i];
  }
  return myObject;
};