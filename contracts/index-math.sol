pragma solidity 0.8.7;

// SPDX-License-Identifier: UNLICENSED
library IndexMath {
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

    function stepForIndex(
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
}
