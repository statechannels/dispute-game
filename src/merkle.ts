import {sha3_256} from 'js-sha3';
import _ from 'lodash';
import MerkleTree from 'merkle-tools';
import {Proof as MerkleToolsProof} from 'merkle-tools';

type Proof = MerkleToolsProof<string>[];

export type Hash = string;
export type WitnessProof = {
  witness: Hash;
  proof: Proof;
};

// Used to create a full binary tree.
function padLeaves(hashes: Hash[]) {
  const paddingLength = Math.pow(2, Math.ceil(Math.log2(hashes.length))) - hashes.length;
  const padding = _.range(paddingLength).map(i => sha3_256('0'));
  return [...hashes, ...padding];
}

export function generateWitness(hashes: Hash[], index: number): WitnessProof {
  const tree = new MerkleTree({hashType: 'SHA3-256'});
  tree.addLeaves(padLeaves(hashes), false);
  tree.makeTree();

  const root = tree.getMerkleRoot()?.toString('hex');
  const witness = tree.getLeaf(index)?.toString('hex');
  const proof = tree.getProof(index);

  if (!root || !witness || !proof) {
    throw new Error('Invalid node or proof!');
  }
  return {witness, proof};
}

export function validateWitness(witnessProof: WitnessProof, root: string, depth: number): boolean {
  const tree = new MerkleTree({hashType: 'SHA3-256'});
  const {proof, witness} = witnessProof;

  if (witnessProof.proof.length !== depth) {
    throw new Error(
      `The witness provided is not for a leaf node. Expected ${depth} witness length, recieved ${witnessProof.proof.length}`
    );
  }
  return tree.validateProof(proof as any, witness, root);
}

export function generateRoot(stateHashes: Hash[]): Hash {
  const tree = new MerkleTree({hashType: 'SHA3-256'});
  tree.addLeaves(padLeaves(stateHashes), false);
  tree.makeTree();
  const root = tree.getMerkleRoot();
  if (!root) {
    throw new Error('Could not calculate root');
  }
  return root.toString('hex');
}
