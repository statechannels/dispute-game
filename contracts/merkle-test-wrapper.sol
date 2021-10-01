pragma solidity 0.8.9;
// SPDX-License-Identifier: UNLICENSED
import './merkle-utils.sol';

contract MerkleTestWrapper {
    function generateRoot(bytes32[] memory leaves) external pure returns (bytes32) {
        return MerkleUtils.generateRoot(leaves);
    }

    function validateWitness(WitnessProof calldata proof, bytes32 root)
        external
        pure
        returns (bool)
    {
        return MerkleUtils.validateWitness(proof, root);
    }
}
