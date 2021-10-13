pragma solidity 0.8.9;

// SPDX-License-Identifier: UNLICENSED

struct WitnessProof {
    bytes32 witness;
    uint256 index;
    bytes32[] nodes;
}

library MerkleUtils {
    /**
     * Determine if a a segment can be split further
     */
    function canSplitFurther(
        uint256 consensusIndex,
        uint256 disputedIndex,
        uint256 numSplits
    ) public pure returns (bool) {
        return disputedIndex - consensusIndex > numSplits;
    }

    /**
     * Calculate the number of leaves in a binary merkle tree
     */
    function expectedNumOfLeaves(
        uint256 loStep,
        uint256 hiStep,
        uint256 numSplits
    ) public pure returns (uint256) {
        if (canSplitFurther(loStep, hiStep, numSplits)) {
            return numSplits + 1;
        } else {
            return hiStep - loStep + 1;
        }
    }

    /**
     * Calculates the index of an element in a binary merkle tree
     * @param index The index of the state that is an element of a sequence of states
     * @param consensusIndex The index in the array of the consensus element
     * @param disputedIndex The index in the array of the disputed element
     * @param numSplits The number of segments between the lowest and the highest split.
     */
    function getLeafIndex(
        uint256 index,
        uint256 consensusIndex,
        uint256 disputedIndex,
        uint256 numSplits
    ) public pure returns (uint256) {
        if (index < 0 || index >= expectedNumOfLeaves(consensusIndex, disputedIndex, numSplits)) {
            revert('Invalid index');
        }

        if (((disputedIndex - consensusIndex) / numSplits) == 0) {
            return consensusIndex + index;
        }

        return consensusIndex + ((disputedIndex - consensusIndex) / numSplits) * index;
    }

    /**
     * Calculates the root of a binary merkle tree. If the tree is uneven it will be padded so it's a full tree.
     * @param leaves The elements to create the binary merkle tree from
     */
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

    /**
     * Valiates that a witness in  a member of the binary merkle tree with the given root.
     * @param proof The witness proof specifiying the witness value and sibling nodes and index.
     * @param root The root of the binary merkle tree that we expect.
     */
    function validateWitness(WitnessProof calldata proof, bytes32 root)
        external
        pure
        returns (bool)
    {
        bytes32 currentHash = proof.witness;
        uint256 index = proof.index;

        for (uint256 i = 0; i < proof.nodes.length; i++) {
            if (index % 2 != 0) {
                currentHash = keccak256(abi.encode(proof.nodes[i], currentHash));
            } else {
                currentHash = keccak256(abi.encode(currentHash, proof.nodes[i]));
            }
            index = index / 2;
        }

        if (currentHash == root) {
            return true;
        }
        return false;
    }

    /**
     * Adds dummy elements to the array so that the binary merkle tree is every child node has a sibling.
     * @param hashes The root of the binary merkle tree that we expect.
     */
    function padLeaves(bytes32[] memory hashes) private pure returns (bytes32[] memory) {
        uint256 result = log2(hashes.length);
        // If we already have a full tree just return the hashes
        if (2**result == hashes.length) {
            return hashes;
        }

        uint256 fullTreeLength = 2**(result + 1);

        bytes32[] memory paddedTree = new bytes32[](fullTreeLength);

        uint256 i = 0;
        for (i = 0; i < fullTreeLength; i++) {
            if (i < hashes.length) {
                paddedTree[i] = hashes[i];
            } else {
                // Add a dummy entry
                paddedTree[i] = keccak256(abi.encode(0x0));
            }
        }

        return paddedTree;
    }
}

// Stolen from https://medium.com/coinmonks/math-in-solidity-part-5-exponent-and-logarithm-9aef8515136e
function log2(uint256 x) pure returns (uint256) {
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
