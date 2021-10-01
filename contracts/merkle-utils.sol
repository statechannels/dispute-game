pragma solidity 0.8.9;

// SPDX-License-Identifier: UNLICENSED

struct WitnessProof {
    bytes32 witness;
    uint256 index;
    bytes32[] nodes;
}

library MerkleUtils {
    function interval(
        uint256 loStep,
        uint256 hiStep,
        uint256 numSplits
    ) internal pure returns (uint256) {
        return (hiStep - loStep) / numSplits;
    }

    function expectedNumOfLeaves(
        uint256 loStep,
        uint256 hiStep,
        uint256 numSplits
    ) internal pure returns (uint256) {
        if (interval(loStep, hiStep, numSplits) >= 1) {
            return numSplits + 1;
        } else {
            return hiStep - loStep + 1;
        }
    }

    function getLeafIndex(
        uint256 index,
        uint256 consensusStep,
        uint256 disputedStep,
        uint256 numSplits
    ) public pure returns (uint256) {
        if (index < 0 || index >= expectedNumOfLeaves(consensusStep, disputedStep, numSplits)) {
            revert('Invalid index');
        }
        if (index == expectedNumOfLeaves(consensusStep, disputedStep, numSplits) - 1) {
            return disputedStep;
        }
        uint256 stepDelta = interval(consensusStep, disputedStep, numSplits);
        if (stepDelta < 1) {
            stepDelta = 1;
        }

        return consensusStep + stepDelta * index;
    }

    function generateRoot(bytes32[] memory leaves) external pure returns (bytes32) {
        bytes32[] memory paddedLeaves = padLeaves(leaves);
        uint256 treeDepth = log2(paddedLeaves.length);
        for (uint256 depth = 0; depth < treeDepth; depth++) {
            uint256 offset = 2**depth;

            for (uint256 index = 0; index < paddedLeaves.length; index = index + 2 * offset) {
                bytes32 parentValue = keccak256(
                    abi.encodePacked(paddedLeaves[index], paddedLeaves[index + offset])
                );

                paddedLeaves[index] = parentValue;
            }
        }

        return paddedLeaves[0];
    }

    function validateWitness(WitnessProof calldata proof, bytes32 root)
        external
        pure
        returns (bool)
    {
        bytes32 currentHash = proof.witness;
        uint256 index = proof.index;

        for (uint256 i = 0; i < proof.nodes.length; i++) {
            if (index % 2 != 0) {
                currentHash = keccak256(abi.encodePacked(proof.nodes[i], currentHash));
            } else {
                currentHash = keccak256(abi.encodePacked(currentHash, proof.nodes[i]));
            }
            index = index / 2;
        }

        if (currentHash == root) {
            return true;
        }
        return false;
    }

    function padLeaves(bytes32[] memory hashes) private pure returns (bytes32[] memory) {
        uint256 fullTreeLength = 2**(log2(hashes.length));
        bytes32[] memory paddedTree = new bytes32[](fullTreeLength);

        uint256 i = 0;
        for (i = 0; i < fullTreeLength; i++) {
            if (i <= hashes.length) {
                paddedTree[i] = hashes[i];
            } else {
                // Add a dummy entry
                paddedTree[i] = keccak256(abi.encodePacked());
            }
        }

        return paddedTree;
    }
}

function log2(uint256 x) pure returns (uint256) {
    // Stolen from https://medium.com/coinmonks/math-in-solidity-part-5-exponent-and-logarithm-9aef8515136e
    uint256 n = 0;
    if (x >= 2**128) {
        x >>= 128;
        n += 128;
    }
    if (x >= 2**64) {
        x >>= 64;
        n += 64;
    }
    if (x >= 2**32) {
        x >>= 32;
        n += 32;
    }
    if (x >= 2**16) {
        x >>= 16;
        n += 16;
    }
    if (x >= 2**8) {
        x >>= 8;
        n += 8;
    }
    if (x >= 2**4) {
        x >>= 4;
        n += 4;
    }
    if (x >= 2**2) {
        x >>= 2;
        n += 2;
    }
    if (x >= 2**1) {
        /* x >>= 1; */
        n += 1;
    }
    return n;
}
