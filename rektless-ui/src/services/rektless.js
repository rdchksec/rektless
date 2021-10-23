import * as ethers from 'ethers';
import Config from 'Config';
import { FeeMarketEIP1559Transaction } from "@ethereumjs/tx";
import Common from "@ethereumjs/common";
import erc20Abi from '../abi/erc20Abi.json';
import migratorAbi from '../abi/migratorAbi.json';
import protocolAbi from '../abi/protocolAbi.json';

const common = new Common({ chain: Config['chain'], hardfork: 'london' });

export default class Rektless {
    constructor(provider) {
        this.provider = new ethers.providers.Web3Provider(provider);
    }

    async getProfilesAsync() {
        try {
            let response = await fetch(Config['rektlessApiUrl'] + '/rektLessProfiles', {
                method: "GET",
                cache: "no-cache"
            });

            if (response.status === 200) {
                return await response.json();
            }
        } catch (e) {
            console.log(e);
        }

        return false;
    }

    async addProfileAsync(protocolAddress, migratorContractAddress, stakingTokenContractAddress, protocolName) {
        try {
            let response = await fetch(Config['rektlessApiUrl'] + '/rektLessProfiles', {
                method: "POST",
                cache: "no-cache",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ protocolAddress, migratorContractAddress, stakingTokenContractAddress, protocolName })
            });
            if (response.status === 200) {
                return await response.json();
            }
            response = await response.json();
            if (response.message) {
                return {
                    errorMessage: response.message
                }
            }
        } catch (e) {
            console.log(e);
        }

        return false;
    }

    async deleteProfileAsync(protocolAddress) {
        try {
            let response = await fetch(Config['rektlessApiUrl'] + '/rektLessProfiles/' + protocolAddress, {
                method: "DELETE",
                cache: "no-cache",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200) {
                return await response.json();
            }
        } catch (e) {
            console.log(e);
        }
        return false;
    }

    async addUserMigrationAsync(approvalTransaction, migrationTransaction, protocolAddress) {
        try {
            let response = await fetch(Config['rektlessApiUrl'] + `/rektLessProfiles/${protocolAddress}/userMigrations`, {
                method: "POST",
                cache: "no-cache",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ approvalTransaction, migrationTransaction })
            });
            if (response.status === 200) {
                return true;
            }
            response = await response.json();
            if (response.message) {
                return {
                    errorMessage: response.message
                }
            }
        } catch (e) {
            console.log(e);
        }

        return false;
    }

    async runMigrationTransactionAsync(unpauseTransaction, pauseTransaction, protocolAddress) {
        try {
            let response = await fetch(Config['rektlessApiUrl'] + `/rektLessProfiles/${protocolAddress}/run`, {
                method: "POST",
                cache: "no-cache",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ unpauseTransaction, pauseTransaction })
            });
            if (response.status === 200) {
                return await response.json();
            }
            response = await response.json();
            if (response.message) {
                return {
                    errorMessage: response.message
                }
            }
        } catch (e) {
            console.log(e);
        }

        return false;
    }

    async createApprowalTxAsync(walletAddress, tokenContractAddress, migratorContractAddress, nonce, maxFeePerGasBN, maxPriorityFeePerGasBN) {
        try {
            let tokenContract = this.createErc20ContractClient(tokenContractAddress);
            let tx = await tokenContract.populateTransaction.approve(
                migratorContractAddress,
                ethers.constants.MaxUint256
            );

            maxFeePerGasBN = maxFeePerGasBN.mul(ethers.BigNumber.from(5));
            maxPriorityFeePerGasBN = maxPriorityFeePerGasBN.mul(ethers.BigNumber.from(3));

            let txFactory = FeeMarketEIP1559Transaction.fromTxData({
                type: "0x02",
                chainId: ethers.utils.hexlify(Config['chainId']),
                maxFeePerGas: maxFeePerGasBN._hex,
                maxPriorityFeePerGas: maxPriorityFeePerGasBN._hex,
                nonce: ethers.utils.hexlify(ethers.BigNumber.from(nonce), { hexPad: "left" }),
                gasLimit: ethers.utils.hexlify(ethers.BigNumber.from(300000), { hexPad: "left" }),
                to: tx.to,
                value: ethers.utils.hexlify(ethers.BigNumber.from(0)),
                data: tx.data
            }, { common });

            return {
                rawData: await this.signMessageAsync(walletAddress, txFactory)
            };
        } catch (e) {
            console.log(e);
            return {
                errorMessage: e.message
            }
        }
    }

    async createMigrationTxAsync(walletAddress, migratorContractAddress, nonce, maxFeePerGasBN, maxPriorityFeePerGasBN) {
        try {
            let migratorContract = this.createMigratorContractClient(migratorContractAddress);
            let tx = await migratorContract.populateTransaction.migrateToFixedContract();

            maxFeePerGasBN = maxFeePerGasBN.mul(ethers.BigNumber.from(5));
            maxPriorityFeePerGasBN = maxPriorityFeePerGasBN.mul(ethers.BigNumber.from(3));

            let txFactory = FeeMarketEIP1559Transaction.fromTxData({
                type: "0x02",
                chainId: ethers.utils.hexlify(Config['chainId']),
                maxFeePerGas: maxFeePerGasBN._hex,
                maxPriorityFeePerGas: maxPriorityFeePerGasBN._hex,
                nonce: ethers.utils.hexlify(ethers.BigNumber.from(nonce), { hexPad: "left" }),
                gasLimit: ethers.utils.hexlify(ethers.BigNumber.from(300000), { hexPad: "left" }),
                to: migratorContractAddress,
                value: ethers.utils.hexlify(ethers.BigNumber.from(0)),
                data: tx.data
            }, { common });

            return {
                rawData: await this.signMessageAsync(walletAddress, txFactory)
            };
        } catch (e) {
            console.log(e);
            return {
                errorMessage: e.message
            }
        }
    }

    async createPauseTxAsync (walletAddress, profile, pauseStatus, nonce, maxFeePerGasBN, maxPriorityFeePerGasBN) {
        try {
            let protocolContract = this.createProtocolContractClient(profile.protocolAddress);
            let tx = await protocolContract.populateTransaction.pause(pauseStatus);

            maxFeePerGasBN = maxFeePerGasBN.mul(ethers.BigNumber.from(5));
            maxPriorityFeePerGasBN = maxPriorityFeePerGasBN.mul(ethers.BigNumber.from(3));

            let txFactory = FeeMarketEIP1559Transaction.fromTxData({
                type: "0x02",
                chainId: ethers.utils.hexlify(Config['chainId']),
                maxFeePerGas: maxFeePerGasBN._hex,
                maxPriorityFeePerGas: maxPriorityFeePerGasBN._hex,
                nonce: ethers.utils.hexlify(ethers.BigNumber.from(nonce), { hexPad: "left" }),
                gasLimit: ethers.utils.hexlify(ethers.BigNumber.from(200000), { hexPad: "left" }),
                to: profile.protocolAddress,
                value: ethers.utils.hexlify(ethers.BigNumber.from(0)),
                data: tx.data
            }, { common });

            return {
                rawData: await this.signMessageAsync(walletAddress, txFactory)
            };
        } catch (e) {
            console.log(e);
            return {
                errorMessage: e.message
            }
        }
    }

    async signMessageAsync(walletAddress, txFactory) {
        let unsignedTx = txFactory.getMessageToSign();
        let signature = await window.ethereum.request({
            method: 'eth_sign',
            params: [
                walletAddress,
                ethers.utils.hexlify(unsignedTx)
            ]
        });

        let signatureParts = ethers.utils.splitSignature(signature);

        let txWithSignature = txFactory._processSignature(
            signatureParts.v,
            ethers.utils.arrayify(signatureParts.r),
            ethers.utils.arrayify(signatureParts.s)
        );

        return ethers.utils.hexlify(txWithSignature.serialize());
    }

    async getTxCountAsync(address) {
        return await this.provider.getTransactionCount(address);
    }

    async getFeeDataAsync() {
        return await this.provider.getFeeData();
    }

    createErc20ContractClient(tokenContractAddress) {
        return new ethers.Contract(tokenContractAddress, erc20Abi, this.provider);
    }

    createMigratorContractClient(migratorContractAddress) {
        return new ethers.Contract(migratorContractAddress, migratorAbi, this.provider);
    }

    createProtocolContractClient(protocolContractAddress) {
        return new ethers.Contract(protocolContractAddress, protocolAbi, this.provider);
    }

    get24HoursDeadline() {
        return Math.floor(Date.now() / 1000) + 60 * 1440;
    }
}