const axios = require('axios');
const HttpError = require('../models/http-error');

const API_KEY = process.env.GOOGLE_API_KEY;

const getCoordsForAddress = async address => {
  const {data} = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address,
    )}&key=${API_KEY}`,
  );
  if (!data || data.status === 'ZERO_RESULTS')
    throw new HttpError('Could not find location for the specified address', 422);
  console.log(data);
  return data.results[0].geometry.location;
  // return {
  //   lat: 40.7484474,
  //   lng: -73.9871516,
  // };
};

module.exports = getCoordsForAddress;
