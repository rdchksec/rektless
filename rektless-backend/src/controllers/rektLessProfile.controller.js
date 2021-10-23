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

    //TODO: Enable when have unpause and pause transactions in state
    // let simulationResult = await flashBotsService.simulateBundleAsync([approvalTransaction, migrationTransaction]);
    // if(isInValidSimulationResult(simulationResult)){
    //     return res.status(400).send({ message: "Bad request. Invalid signed transactions" });
    // }

    rektLessProfile.usersMigrationRequests.push({
        approvalTransaction: approvalTransaction,
        migrationTransaction: migrationTransaction
    });

    rektLessProfile = await rektLessProfileService.saveRektLessProfileAsync(rektLessProfile);

    return res.status(200).send(rektLessProfile);
}

const runRektLessProfileMigrationAsync = async (req, res) => {
    const { protocolAddress } = req.params;
    const { unpauseTransaction, pauseTransaction } = req.body;
    if (!unpauseTransaction || !pauseTransaction ) {
        return res.status(400).send({ message: "Bad request. You should add unpause and pause transactions" });
    }

    let rektLessProfile = await rektLessProfileService.getRektLessProfileAsync(protocolAddress);
    if(!rektLessProfile){
        return res.status(404).send({ message: "Bad request. No such rektless profile" });
    }

    //Simulate Each Migration Request and submit a block
    let transactionsToSubmit = [];
    await Promise.all(rektLessProfile.usersMigrationRequests.map(async (umr) => {
        const simulationResult = await flashBotsService.simulateBundleAsync([unpauseTransaction, umr.approvalTransaction, umr.migrationTransaction, pauseTransaction])
        if(!isInValidSimulationResult(simulationResult)){
            transactionsToSubmit.push(umr.approvalTransaction);
            transactionsToSubmit.push(umr.migrationTransaction);
        }
    }));

    if(transactionsToSubmit.length == 0){
        return res.status(400).send({ message: "Nothing to Submit. Unable to submit private transactions." });
    }
    //TODO: add pause and unpause transactions + add their simulation
    transactionsToSubmit = [unpauseTransaction].concat(transactionsToSubmit);
    transactionsToSubmit.push(pauseTransaction);

    let flashSubmissionBotsResult = await flashBotsService.submitBundleToFutureBlockAsync(transactionsToSubmit, 20);
    console.log(flashSubmissionBotsResult);
    if(!flashSubmissionBotsResult || flashSubmissionBotsResult.error){
        return res.status(500).send({ message: "Server Error. Unable to submit private transactions." });
    }

    let txHashes = flashSubmissionBotsResult.bundleTransactions.map(tx => tx.hash);
    return res.status(201).send({ txHashes: txHashes});
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

const isInValidSimulationResult = (flashBotsResult) => !flashBotsResult || flashBotsResult.error || flashBotsResult.result.results.some(r => r.error);

module.exports = {
    createRektLessProfileAsync,
    getRektLessProfilesAsync,
    addUserMigrationRequestAsync,
    runRektLessProfileMigrationAsync,
    removeRektLessProfilesAsync
}