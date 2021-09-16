import MerkleTree from 'merkle-tools';
import _ from 'lodash';
import {Proof as MerkleToolsProof} from 'merkle-tools';

type Proof = MerkleToolsProof<string>[];

export type Hash = string;
export type WitnessProof = {
  witness: Hash;
  proof: Proof;
};

export function generateWitness(hashes: Hash[], index: number): WitnessProof {
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
