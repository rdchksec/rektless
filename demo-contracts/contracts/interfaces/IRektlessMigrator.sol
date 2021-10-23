// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

/**
 * @dev Interface for the Rektless migrator
 */
interface IRektlessMigrator {

    /**
     * @dev Emergency withdraws user's tokens and stakes for it in fixed contract
     */
    function migrateToFixedContract() external;

    /**
     * @dev Extracts tokens to user's account
     */
    function migrateToUserAddress() external;

}