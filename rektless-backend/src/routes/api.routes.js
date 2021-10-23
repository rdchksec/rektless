"use strict";

const express = require('express');
const {
    createRektLessProfileAsync,
    getRektLessProfilesAsync,
    removeRektLessProfilesAsync,
    addUserMigrationRequestAsync,
    runRektLessProfileMigrationAsync
} = require('../controllers/rektLessProfile.controller');

const router = express.Router();

router.route('/ping').get((req, res) => {
    res.status(200).send("pong")
});

router.route('/rektLessProfiles')
    .get(getRektLessProfilesAsync)
    .post(createRektLessProfileAsync);

router.route('/rektLessProfiles/:protocolAddress')
    .delete(removeRektLessProfilesAsync);

router.route('/rektLessProfiles/:protocolAddress/userMigrations')
    .post(addUserMigrationRequestAsync)

router.route('/rektLessProfiles/:protocolAddress/run')
    .post(runRektLessProfileMigrationAsync)

module.exports = router;