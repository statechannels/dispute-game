import {sha3_256} from 'js-sha3';
import MerkleTree from 'merkle-tools';
import {Hash, State, WitnessProof} from './bisection';

export const hashState = (state: State) => sha3_256(state.root.toString());

export function generateWitness(states: State[], index: number): WitnessProof {
  return generateWitnessFromHashes(
    states.map(s => hashState(s)),
    index
  );
}
export function generateWitnessFromHashes(hashes: Hash[], index: number): WitnessProof {
  const tree = new MerkleTree({hashType: 'SHA3-256'});
  tree.addLeaves(hashes, false);
  tree.makeTree();

  const root = tree.getMerkleRoot()?.toString('hex');
  const witness = tree.getLeaf(index)?.toString('hex');
  const proof = tree.getProof(index);
  

  if (!root || !witness || !proof) {
    throw new Error('Invalid node or proof!');
  }
  return {witness, proof};
}

export function validateWitness(witnessProof: WitnessProof, root: string): boolean {
  const tree = new MerkleTree({hashType: 'SHA3-256'});
  const {proof, witness} = witnessProof;
  return tree.validateProof(proof as any, witness, root);
}

export function generateRoot(stateHashes: Hash[]): Hash {
  const tree = new MerkleTree({hashType: 'SHA3-256'});
  tree.addLeaves(stateHashes, false);
  tree.makeTree();
  const root = tree.getMerkleRoot();
  if (!root) {
    throw new Error('Could not calculate root');
  }
  return root.toString('hex');
}
