const express = require('express');

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

    if (!place) {
        const error = new Error('Could not find a place for provided id.');
        error.code = 404;
        throw error;
    }

    res.json({place});
});

router.get('/user/:uid', (req, res, next) => {
    const {uid: userId} = req.params;
    const place = DUMMY_PLACES.find(place => place.creator === userId);

    if (!place) {

        const error = new Error('Could not find a place for provided user id.');
        error.code = 404;
        return next(error);

    }

    res.json({place});
});

module.exports = router;