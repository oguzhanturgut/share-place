const express = require('express');

const HttpError = require('../models/http-error');

const router = express.Router();

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

router.get('/:pid', (req, res) => {
    const {pid} = req.params;
    const place = DUMMY_PLACES.find(place => place.id === pid);

    if (!place)
        throw new HttpError('Could not find a place for provided id.', 404);
    
    res.json({place});
});

router.get('/user/:uid', (req, res, next) => {
    const {uid: userId} = req.params;
    const place = DUMMY_PLACES.find(place => place.creator === userId);

    if (!place)
        return next(new HttpError('Could not find a place for provided user id.', 404));

    res.json({place});
});

module.exports = router;