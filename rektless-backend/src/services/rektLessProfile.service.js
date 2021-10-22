"use strict";

let rektLessProfiles = {
    "protocolAddress..0x...": {
        protocolName: "ShitCoinFarmingDefi",
        migratorContractAddress: "0x...",
        stakingTokenContractAddress: "0x...",
        usersMigrationRequests: [{
            signedApprovalTransaction: "0x...",
            signedMigrateTransaction: "0x..."
        }]
    }
};

const getRektLessProfileAsync = async (protocolAddress) => {
    return rektLessProfiles[protocolAddress];
}

const saveRektLessProfileAsync = async (rektLessProfileToSave) => {
    rektLessProfiles[rektLessProfileToSave.protocolAddress] = rektLessProfileToSave;
    return rektLessProfileToSave;
}

const getAllRektLessProfilesAsync = async () => {
    return rektLessProfiles;
}

const removeRektLessProfileAsync = async (protocolAddress) => {
    rektLessProfiles[protocolAddress] = null;
}

module.exports = {
    saveRektLessProfileAsync,
    getAllRektLessProfilesAsync,
    getRektLessProfileAsync,
    removeRektLessProfileAsync
}