pragma solidity 0.8.7;

// SPDX-License-Identifier: UNLICENSED

library MerkleHelper {
    function generateRoot(bytes32[] memory leaves) external pure returns (bytes32) {
        bytes32[] memory paddedLeaves = padLeaves(leaves);
        uint256 treeDepth = log2(paddedLeaves.length);
        for (uint256 depth = treeDepth - 1; depth > 0; depth--) {
            for (uint256 index = 0; index < 2**treeDepth; index = index + 2) {
                bytes32 parentValue = keccak256(
                    abi.encodePacked(paddedLeaves[index], paddedLeaves[index + 1])
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
        bytes32[] memory paddedLeaves = padLeaves(proof.nodes);
        uint256 depth = log2(paddedLeaves.length);

        for (uint256 i = depth - 1; i > 0; i--) {
            for (uint256 index = 0; index < 2**depth; index = index + 2) {
                bytes32 parentValue = keccak256(
                    abi.encodePacked(paddedLeaves[index], paddedLeaves[index + 1])
                );
                paddedLeaves[index] = parentValue;
            }
        }

        if (paddedLeaves[0] != root) {
            return false;
        }
        return true;
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

    function log2(uint256 x) public pure returns (uint256) {
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
}

struct WitnessProof {
    bytes32 witness;
    uint256 index;
    bytes32[] nodes;
}
