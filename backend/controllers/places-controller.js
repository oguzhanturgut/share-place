const mongoose = require('mongoose');
const fs = require('fs');
const {validationResult} = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');

const Place = require('../models/place');
const User = require('../models/user');

const getPlaceById = async (req, res, next) => {
    const {pid} = req.params;
    let place;
    try {
        place = await Place.findById(pid).exec();
    } catch (error) {
        return next(new HttpError('Something went wrong, could not find the place'), 500);
    }

    if (!place) return next(new HttpError('Could not find a place for provided id', 404));

    res.json({place: place.toObject({getters: true})});
};

const getPlacesByUserId = async (req, res, next) => {
    const {uid: userId} = req.params;

    let userWithPlaces;
    try {
        userWithPlaces = await User.findById(userId).populate('places');
    } catch (error) {
        return next(new HttpError('Fetching places failed, please try again'), 500);
    }

    if (!userWithPlaces || userWithPlaces.length === 0)
        return next(new HttpError('Could not find a place for provided user id', 404));

    res.json({places: userWithPlaces.places.map(place => place.toObject({getters: true}))});
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors.mapped());
    if (!errors.isEmpty()) return next(new HttpError('Invalid value', 422));

    const {title, description, address, creator} = req.body;

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
        image: req.file.path,
        creator,
    });

    let user;
    try {
        user = await User.findById(creator);
    } catch (error) {
        return next(new HttpError('Creating place failed'), 500);
    }

    if (!user) return next(new HttpError('Could not find user for specified id'), 404);

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await newPlace.save({session});
        user.places.push(newPlace);
        await user.save({session});
        session.commitTransaction();
    } catch (error) {
        console.log(error);
        return next(new HttpError('Creating place failed'), 500);
    }

    res.status(201).json({place: newPlace});
};

const updatePlaceById = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new HttpError('Invalid value', 422));

    const {pid} = req.params;
    const {title, description} = req.body;

    let place;
    try {
        place = await Place.findByIdAndUpdate(
            pid,
            {title, description},
            {new: true, useFindAndModify: false},
        ).exec();
    } catch (error) {
        console.log(error);
        return next(new HttpError('Something went wrong, could not update place', 500));
    }
    if (place) {
        res.status(200).json({place});
    } else {
        return next(new HttpError('Could not find a place for provided id', 404));
    }
};

const deletePlaceById = async (req, res, next) => {
    const {pid} = req.params;

    let place;
    try {
        place = await Place.findById(pid).populate('creator');
    } catch (error) {
        return next(new HttpError('Something went wrong, could not delete place'));
    }

    if (!place) return next(new HttpError('Place not found'), 404);

    const imagePath = place.image;

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        place.remove({session});
        place.creator.places.pull(place);
        await place.creator.save({session});
        session.commitTransaction();
        await place.remove();
    } catch (error) {
        return next(new HttpError('Something went wrong, could not delete place'));
    }

    fs.unlink(imagePath, err => console.log(err));

    res.status(200).json({message: 'Deleted place'});
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
