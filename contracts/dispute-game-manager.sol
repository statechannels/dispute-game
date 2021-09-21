pragma solidity 0.8.7;
// SPDX-License-Identifier: UNLICENSED
import './merkle.sol';
import './index-math.sol';

contract DisputeGameManager {
    bytes32 root;
    uint256 numOfSplits;
    uint256 highestStep;
    uint256 lowestStep;
    string caller;

    constructor(
        bytes32[] memory _hashes,
        uint256 _disputedStep,
        string memory _caller,
        uint256 _numOfSplits
    ) {
        root = MerkleHelper.generateRoot(_hashes);
        highestStep = _disputedStep;
        caller = _caller;
        numOfSplits = _numOfSplits;
        lowestStep = 0;
    }

    function expectedNumOfLeaves() private view returns (uint256) {
        return IndexMath.expectedNumOfLeaves(lowestStep, highestStep, numOfSplits);
    }

    function depth() private view returns (uint256) {
        return MerkleHelper.log2(expectedNumOfLeaves());
    }

    function checkWitnesses(WitnessProof memory consensusProof, WitnessProof memory disputedProof)
        public
        view
    {
        if (consensusProof.index >= 2 - 1) {
            revert('Consensus witness cannot be the last stored state');
        }

        bool validConsensusWitness = MerkleHelper.validateWitness(consensusProof, root, depth());
        if (!validConsensusWitness) {
            revert('Invalid consensus witness proof');
        }

        bool validDisputeWitness = MerkleHelper.validateWitness(disputedProof, root, depth());
        if (!validDisputeWitness) {
            revert('Invalid dispute witness proof');
        }

        if (consensusProof.index + 1 != disputedProof.index) {
            revert('Disputed state hash must be the next leaf after consensus state hash');
        }
    }

    function split(
        WitnessProof calldata consensusProof,
        bytes32[] calldata hashes,
        WitnessProof calldata disputedProof,
        string calldata _caller
    ) external {
        if (interval() < 1) {
            revert('States cannot be split further');
        }

        this.checkWitnesses(consensusProof, disputedProof);

        if (hashes[hashes.length - 1] == disputedProof.witness) {
            revert('The last state supplied must differ from the disputed witness');
        }

        uint256 newConsensusStep = stepForIndex(consensusProof.index);

        // The else case is when the consensus state is the second to last state in the state list.
        // In that case, the disputed step not need to be updated.
        uint256 newDisputedStep = lowestStep;
        if (consensusProof.index != numOfSplits - 1) {
            newDisputedStep = stepForIndex(consensusProof.index + 1);
        }
        // The leaves are formed by concatenating consensusWitness + leaves supplied by the caller
        uint256 intermediateLeaves = IndexMath.expectedNumOfLeaves(
            newConsensusStep,
            newDisputedStep,
            numOfSplits
        ) - 1;
        if (hashes.length != intermediateLeaves) {
            revert('Incorrect amount of state hashes');
        }

        // Effects
        lowestStep = newConsensusStep;
        highestStep = newDisputedStep;
        bytes32[] memory newStateHashes = new bytes32[](hashes.length + 1);

        newStateHashes[0] = consensusProof.witness;
        for (uint256 i = 1; i < hashes.length + 1; i++) {
            newStateHashes[i] = hashes[i - 1];
        }

        root = MerkleHelper.generateRoot(newStateHashes);
        caller = _caller;
    }

    function interval() public view returns (uint256) {
        return IndexMath.interval(lowestStep, highestStep, numOfSplits);
    }

    function stepForIndex(uint256 index) private view returns (uint256) {
        return IndexMath.stepForIndex(index, lowestStep, highestStep, numOfSplits);
    }
}
