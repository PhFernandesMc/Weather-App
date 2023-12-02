const getPlaceInfo = (autocomplete) => {
  const place = autocomplete.getPlace();
  const cityName = place.address_components[0];
  let countryName = null;
  if (place.address_components.length < 4) {
    countryName = place.address_components[2];
  } else {
    countryName = place.address_components[3];
  }
  const location = place.geometry.location;
  const lat = location.lat();
  const lng = location.lng();
  return {
    cityName: cityName.long_name,
    countryName: countryName.short_name,
    lat: lat,
    lng: lng,
  };
};
