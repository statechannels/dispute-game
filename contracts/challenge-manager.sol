pragma solidity 0.8.9;
// SPDX-License-Identifier: UNLICENSED
import './merkle-utils.sol';

enum ChallengeStatus {
    InProgress,
    FraudDetected,
    Forfeited
}

contract ChallengeManager {
    bytes32 root;
    uint256 splitFactor;
    uint256 disputedIndex;
    uint256 consensusIndex;
    string lastMover;
    ChallengeStatus public currentStatus;

    constructor(
        bytes32[] memory _values,
        uint256 _numSteps,
        string memory _lastMover,
        uint256 _splitFactor
    ) {
        root = MerkleUtils.generateRoot(_values);
        require(_splitFactor > 1, 'The splitting factor must be above 1');
        require(_numSteps >= 1, 'There must be at least one element');
        require(_values.length == _splitFactor + 1, 'There must be k+1 values');

        disputedIndex = _numSteps;
        lastMover = _lastMover;
        splitFactor = _splitFactor;
        consensusIndex = 0;
        currentStatus = ChallengeStatus.InProgress;
    }

    function forfeit(string calldata _mover) public {
        if (keccak256(abi.encode(_mover)) == keccak256(abi.encode(lastMover))) {
            revert('The mover cannot be the same as the last mover');
        }
        currentStatus = ChallengeStatus.Forfeited;
    }

    function fraudDetected(uint256 index, string calldata _mover) public {
        if (keccak256(abi.encode(_mover)) == keccak256(abi.encode(lastMover))) {
            revert('The mover cannot be the same as the last mover');
        }
        uint256 nextLeafIndex = getLeafIndex(index + 1);

        uint256 currentLeafIndex = getLeafIndex(index);

        require(currentLeafIndex + 1 == nextLeafIndex, 'Must be sibling nodes');
        currentStatus = ChallengeStatus.FraudDetected;
    }

    function split(
        WitnessProof calldata _consensusProof,
        bytes32[] calldata _hashes,
        WitnessProof calldata _disputedProof,
        string calldata _mover
    ) external {
        if (keccak256(abi.encode(_mover)) == keccak256(abi.encode(lastMover))) {
            revert('The mover cannot be the same as the last mover');
        }
        if (!canSplitFurther()) {
            revert('States cannot be split further');
        }

        if (currentStatus != ChallengeStatus.InProgress) {
            revert('The challenge is already complete');
        }
        checkConsensusAndDisputeWitnesses(_consensusProof, _disputedProof);

        if (_hashes[_hashes.length - 1] == _disputedProof.witness) {
            revert('The last state supplied must differ from the disputed witness');
        }

        uint256 newConsensusLeafIndex = getLeafIndex(_consensusProof.index);

        // The else case is when the consensus state is the second to last state in the state list.
        // In that case, the disputed step not need to be updated.
        uint256 newDisputedLeafIndex = getLeafIndex(_disputedProof.index);

        if (_consensusProof.index != splitFactor - 1) {
            newDisputedLeafIndex = getLeafIndex(_consensusProof.index + 1);
        }
        // The leaves are formed by concatenating consensusWitness + leaves supplied by the caller
        uint256 intermediateLeaves = MerkleUtils.expectedNumOfLeaves(
            newConsensusLeafIndex,
            newDisputedLeafIndex,
            splitFactor
        ) - 1;

        if (_hashes.length != intermediateLeaves) {
            revert('Incorrect amount of state hashes');
        }

        // Effects
        consensusIndex = newConsensusLeafIndex;
        disputedIndex = newDisputedLeafIndex;
        bytes32[] memory newStateHashes = new bytes32[](_hashes.length + 1);

        newStateHashes[0] = _consensusProof.witness;
        for (uint256 i = 1; i < _hashes.length + 1; i++) {
            newStateHashes[i] = _hashes[i - 1];
        }

        root = MerkleUtils.generateRoot(newStateHashes);
        lastMover = _mover;
    }

    function checkConsensusAndDisputeWitnesses(
        WitnessProof memory consensusProof,
        WitnessProof memory disputedProof
    ) internal view {
        if (consensusProof.index >= expectedNumOfLeaves() - 1) {
            revert('Consensus witness cannot be the last stored state');
        }

        bool validConsensusWitness = validateLeafWitness(consensusProof, root, treeDepth());
        if (!validConsensusWitness) {
            revert('Invalid consensus witness proof');
        }

        bool validDisputeWitness = validateLeafWitness(disputedProof, root, treeDepth());
        if (!validDisputeWitness) {
            revert('Invalid dispute witness proof');
        }

        if (consensusProof.index + 1 != disputedProof.index) {
            revert('Disputed state hash must be the next leaf after consensus state hash');
        }
    }

    function validateLeafWitness(
        WitnessProof memory _witnessProof,
        bytes32 _root,
        uint256 _depth
    ) internal pure returns (bool) {
        require(
            _witnessProof.nodes.length == _depth,
            'The witness provided is not for a leaf node.'
        );
        return MerkleUtils.validateWitness(_witnessProof, _root);
    }

    function expectedNumOfLeaves() internal view returns (uint256) {
        return MerkleUtils.expectedNumOfLeaves(consensusIndex, disputedIndex, splitFactor);
    }

    function treeDepth() internal view returns (uint256) {
        uint256 numberOfElements = expectedNumOfLeaves();

        uint256 result = log2(numberOfElements);

        if (2**result == numberOfElements) {
            return result;
        } else {
            return result + 1;
        }
    }

    function getLeafIndex(uint256 index) internal view returns (uint256) {
        return MerkleUtils.getLeafIndex(index, consensusIndex, disputedIndex, splitFactor);
    }

    function canSplitFurther() internal view returns (bool) {
        return MerkleUtils.canSplitFurther(consensusIndex, disputedIndex, splitFactor);
    }
}
