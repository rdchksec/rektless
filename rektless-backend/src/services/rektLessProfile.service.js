"use strict";
const Redis = require('./redis');

const getRektLessProfileAsync = async (protocolAddress) => {
    let res = await Redis.getAsync(protocolAddress);
    return JSON.parse(res);
}

const saveRektLessProfileAsync = async (rektLessProfileToSave) => {
    await Redis.setAsync(rektLessProfileToSave.protocolAddress, JSON.stringify(rektLessProfileToSave));
    return rektLessProfileToSave;
}

const getAllRektLessProfilesAsync = async () => {
    let allRektLessKeys = await Redis.keysAsync("*");

    let rektLessProfiles = [];
    await Promise.all(allRektLessKeys.map(async (protocolAddress) => {
        rektLessProfiles.push(await getRektLessProfileAsync(protocolAddress));
    }));

    return rektLessProfiles;
}

const removeRektLessProfileAsync = async (protocolAddress) => {
    await Redis.delAsync(protocolAddress);
}

module.exports = {
    saveRektLessProfileAsync,
    getAllRektLessProfilesAsync,
    getRektLessProfileAsync,
    removeRektLessProfileAsync
}