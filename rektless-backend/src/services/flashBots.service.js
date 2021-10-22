
"use strict";

const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle');
const ethers = require('ethers');
const appArguments = require('../appArguments').getAppArguments();

const blockChainProvider = new ethers.providers.JsonRpcProvider(appArguments.infuraUrl, appArguments.chainId);
const authSigner = new ethers.Wallet(appArguments.someAccountPrivateKey, blockChainProvider);

const createFlashBotsClientAsync = async () => {
    return await FlashbotsBundleProvider.create(
        blockChainProvider,
        authSigner,
        "https://relay-goerli.flashbots.net",
        "goerli"
    );
}

const simulateBundleAsync = async (transactions, blockNumber) => {
    try {
        if(!blockNumber){
            blockNumber = await blockChainProvider.getBlockNumber();
        }
        const flashbotsProvider = await createFlashBotsClientAsync();
        const simulation = await flashbotsProvider.simulate(transactions, blockNumber);
        console.log(simulation);
        if (simulation && simulation.results) {
            return {
                result: simulation
            };
        } else {
            return simulation;
        }
        
    } catch (e) {
        console.log(e);
    }
    return false;
}

const submitBundleAsync = async (transactions, blockNumber) => {
    try {
        const flashbotsProvider = await createFlashBotsClientAsync();
        const bundleSubmission = flashbotsProvider.sendRawBundle(
            transactions,
            blockNumber
        );
        console.log(bundleSubmission);

        return bundleSubmission;
    } catch (e) {
        console.log(e)
    }

    return false;
}

module.exports = {
    simulateBundleAsync,
    submitBundleAsync
}