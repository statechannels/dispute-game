import './merkle.sol';

contract MerkleWrapper {
    function generateRoot(bytes32[] memory leaves) external pure returns (bytes32) {
        return MerkleHelper.generateRoot(leaves);
    }

    function validateWitness(WitnessProof calldata proof, bytes32 root)
        external
        pure
        returns (bool)
    {
        return MerkleHelper.validateWitness(proof, root);
    }
}
