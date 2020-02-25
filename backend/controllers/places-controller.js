const uuid = require('uuid/v4');

const HttpError = require('../models/http-error');

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        location: {
            lat: 40.7484474,
            lng: -73.9871516
        },
        address: '20 W 34th S, new York',
        creator: 'u1'
    }
];

const getPlaceById = (req, res) => {
    const {pid} = req.params;
    const place = DUMMY_PLACES.find(place => place.id === pid);

    if (!place)
        throw new HttpError('Could not find a place for provided id.', 404);

    res.json({place});
};

const getPlaceByUserId = (req, res, next) => {
    const {uid: userId} = req.params;
    const place = DUMMY_PLACES.find(place => place.creator === userId);

    if (!place)
        return next(new HttpError('Could not find a place for provided user id.', 404));

    res.json({place});
};

const createPlace = (req, res, next) => {
    const {title, description, coordinates, address, creator} = req.body;
    const newPlace = {
        id: uuid(),
        title,
        description,
        location: coordinates,
        address,
        creator
    };
    DUMMY_PLACES.push(newPlace);
    res.status(201).json({place: newPlace});
};

const updatePlaceById = (req, res, next) => {
    const {pid} = req.params;
    const {title, description} = req.body;
    const place = DUMMY_PLACES.find(place => place.id === pid);
    if (place) {
        const placeIndex = DUMMY_PLACES.findIndex(place => place.id === pid);
        const updatedPlace = {
            ...place, title, description
        };
        DUMMY_PLACES[placeIndex] = updatedPlace;
        res.status(200).json({place: updatedPlace});
    } else {
        throw new HttpError('Could not find a place for provided id.', 404);
    }
};

const deletePlaceById = (req, res, next) => {

};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
