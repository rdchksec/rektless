"use strict";
const rektLessProfileService = require('../services/rektLessProfile.service');
const flashBotsService = require('../services/flashBots.service');

const createRektLessProfileAsync = async (req, res) => {
    const { protocolAddress, protocolName, migratorContractAddress, stakingTokenContractAddress } = req.body;

    if (!protocolAddress || !migratorContractAddress || !stakingTokenContractAddress) {
        return res.status(400).send({ message: "Bad request. Please specify required fields for RektLess profile" });
    }

    //TODO: check protocol owner signature
    if(false){
        return res.status(401).send({ message: "Bad request. Only protocol owner is able to create RektLess profile" });
    }

    const rektProfileToSave = req.body;
    rektProfileToSave.usersMigrationRequests = [];
    let rektLessProfile = await rektLessProfileService.saveRektLessProfileAsync(rektProfileToSave);

    return res.status(200).send(rektLessProfile);
}

const getRektLessProfilesAsync = async (req, res) => {
    const allRektLessProfiles = await rektLessProfileService.getAllRektLessProfilesAsync();
    return res.status(200).send(allRektLessProfiles);
}

const addUserMigrationRequestAsync = async (req, res) => {
    const { protocolAddress } = req.params;
    const { approvalTransaction, migrationTransaction } = req.body;

    let rektLessProfile = await rektLessProfileService.getRektLessProfileAsync(protocolAddress);
    if(!rektLessProfile){
        return res.status(404).send({ message: "Bad request. No such rektless profile" });
    }

    let flashBotsResult = await flashBotsService.simulateBundleAsync([approvalTransaction, migrationTransaction]);
    if(!flashBotsResult || flashBotsResult.error){
        return res.status(400).send({ message: "Bad request. Invalid signed transactions" });
    }

    rektLessProfile.usersMigrationRequests.push({
        approvalTransaction: approvalTransaction,
        migrationTransaction: migrationTransaction
    });

    rektLessProfile = await rektLessProfileService.saveRektLessProfileAsync(rektLessProfile);

    return res.status(200).send(rektLessProfile);
}

const runRektLessProfileMigrationAsync = async (req, res) => {
    return res.status(500).send({ message: "Not implemented yet" });
}

const removeRektLessProfilesAsync = async (req, res) => {
    const { protocolAddress } = req.params;

    let rektLessProfile = await rektLessProfileService.getRektLessProfileAsync(protocolAddress);
    if(!rektLessProfile){
        return res.status(404).send({ message: "Bad request. No such rektless profile" });
    }

    await rektLessProfileService.removeRektLessProfileAsync(protocolAddress);

    return res.status(201).send();
}

module.exports = {
    createRektLessProfileAsync,
    getRektLessProfilesAsync,
    addUserMigrationRequestAsync,
    runRektLessProfileMigrationAsync,
    removeRektLessProfilesAsync
}