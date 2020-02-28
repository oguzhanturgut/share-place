const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');

const Place = require('../models/place');

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

const getPlaceById = async (req, res, next) => {
  const { pid } = req.params;
  let place;
  try {
    place = await Place.findById(pid).exec();
  } catch (error) {
    return next(new HttpError('Something went wrong, could not find the place'), 500);
  }

  if (!place) return next(new HttpError('Could not find a place for provided id', 404));

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const { uid: userId } = req.params;

  let places;
  try {
    places = await Place.find({ creator: userId }).exec();
  } catch (error) {
    return next(new HttpError('Fetching places failed, please try again'), 500);
  }

  if (!places || places.length === 0)
    return next(new HttpError('Could not find a place for provided user id', 404));

  res.json({ places: places.map(place => place.toObject({ getters: true })) });
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

  const newPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg',
    creator,
  });

  try {
    await newPlace.save();
  } catch (error) {
    return next(new HttpError('Creating place failed'), 500);
  }

  res.status(201).json({ place: newPlace });
};

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);
  // console.log(errors.mapped());
  if (!errors.isEmpty()) return next(new HttpError('Invalid value', 422));

  const { pid } = req.params;
  const { title, description } = req.body;

  let place;
  try {
    place = await await Place.findByIdAndUpdate(
      pid,
      { title, description },
      { new: true, useFindAndModify: false },
    ).exec();
  } catch (error) {
    console.log(error);
    return next(new HttpError('Something went wrong, could not update place', 500));
  }
  if (place) {
    res.status(200).json({ place });
  } else {
    return next(new HttpError('Could not find a place for provided id', 404));
  }
};

const deletePlaceById = async (req, res, next) => {
  const { pid } = req.params;

  try {
    await Place.findByIdAndDelete(pid).exec();
  } catch (error) {
    return next(new HttpError('Something went wrong, could not delete place'));
  }

  res.status(200).json({ message: 'Deleted place' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
