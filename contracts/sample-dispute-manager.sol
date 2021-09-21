import './dispute-game-manager.sol';

contract SampleDisputeManager is DisputeGameManager {
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

    function fingerprint(bytes32[] calldata consensusStateData)
        public
        pure
        override
        returns (bytes32)
    {
        return keccak256(abi.encode(consensusStateData));
    }

    function progress(bytes32[] calldata consensusStateData)
        public
        pure
        override
        returns (bytes32[] memory)
    {
        consensusStateData[0] << 1;
        return consensusStateData;
    }
}
