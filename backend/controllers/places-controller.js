const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: '20 W 34th S, new York',
    creator: 'u1',
  },
];

const getPlaceById = (req, res) => {
  const { pid } = req.params;
  const place = DUMMY_PLACES.find(place => place.id === pid);

  if (!place) throw new HttpError('Could not find a place for provided id', 404);

  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const { uid: userId } = req.params;
  const places = DUMMY_PLACES.filter(place => place.creator === userId);

  if (!places || places.length === 0)
    return next(new HttpError('Could not find a place for provided user id', 404));

  res.json({ places });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.mapped());
  if (!errors.isEmpty()) return next(new HttpError('Invalid value', 422));

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const newPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };
  DUMMY_PLACES.push(newPlace);
  res.status(201).json({ place: newPlace });
};

const updatePlaceById = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.mapped());
  if (!errors.isEmpty()) throw new HttpError('Invalid value', 422);

  const { pid } = req.params;
  const { title, description } = req.body;
  const place = DUMMY_PLACES.find(place => place.id === pid);
  if (place) {
    const placeIndex = DUMMY_PLACES.findIndex(place => place.id === pid);
    const updatedPlace = {
      ...place,
      title,
      description,
    };
    DUMMY_PLACES[placeIndex] = updatedPlace;
    res.status(200).json({ place: updatedPlace });
  } else {
    throw new HttpError('Could not find a place for provided id', 404);
  }
};

const deletePlaceById = (req, res, next) => {
  const { pid } = req.params;

  if (!DUMMY_PLACES.find(place => place.id !== pid))
    throw new HttpError('Could not find a place to delete', 404);

  DUMMY_PLACES = DUMMY_PLACES.filter(place => place.id !== pid);
  res.status(200).json({ message: 'Deleted place' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
