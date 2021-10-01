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
    ChallengeStatus status;

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
        status = ChallengeStatus.InProgress;
    }

    function expectedNumOfLeaves() private view returns (uint256) {
        return MerkleUtils.expectedNumOfLeaves(disputedIndex, consensusIndex, splitFactor);
    }

    function checkWitnesses(WitnessProof memory consensusProof, WitnessProof memory disputedProof)
        public
        view
    {
        if (consensusProof.index >= 2 - 1) {
            revert('Consensus witness cannot be the last stored state');
        }

        bool validConsensusWitness = MerkleUtils.validateWitness(consensusProof, root);
        if (!validConsensusWitness) {
            revert('Invalid consensus witness proof');
        }

        bool validDisputeWitness = MerkleUtils.validateWitness(disputedProof, root);
        if (!validDisputeWitness) {
            revert('Invalid dispute witness proof');
        }

        if (consensusProof.index + 1 != disputedProof.index) {
            revert('Disputed state hash must be the next leaf after consensus state hash');
        }
    }

    function split(
        WitnessProof calldata _consensusProof,
        bytes32[] calldata _hashes,
        WitnessProof calldata _disputedProof,
        string calldata _mover
    ) external {
        if (MerkleUtils.interval(consensusIndex, disputedIndex, splitFactor) < 1) {
            revert('States cannot be split further');
        }

        // This verifies that both the consensus value and disputed value are members of the tree
        this.checkWitnesses(_consensusProof, _disputedProof);

        if (_hashes[_hashes.length - 1] == _disputedProof.witness) {
            revert('The last state supplied must differ from the disputed witness');
        }

        uint256 newConsensusLeafIndex = MerkleUtils.getLeafIndex(
            _consensusProof.index,
            consensusIndex,
            disputedIndex,
            splitFactor
        );

        // The else case is when the consensus state is the second to last state in the state list.
        // In that case, the disputed step not need to be updated.
        uint256 newDisputedLeafIndex = MerkleUtils.getLeafIndex(
            _disputedProof.index,
            consensusIndex,
            disputedIndex,
            splitFactor
        );

        if (_consensusProof.index != splitFactor - 1) {
            newDisputedLeafIndex = MerkleUtils.getLeafIndex(
                _consensusProof.index + 1,
                consensusIndex,
                disputedIndex,
                splitFactor
            );
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
}
