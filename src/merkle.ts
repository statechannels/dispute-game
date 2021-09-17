import {sha3_256} from 'js-sha3';
import _ from 'lodash';

import MerkleTree, {Proof as MerkleToolsProof} from 'merkle-tools';

export type Hash = string;
export type WitnessProof = {
  witness: Hash;
  nodes: Hash[];
  index: number;
};

// Used to create a full binary tree.
function padLeaves(hashes: Hash[]) {
  const paddingLength = Math.pow(2, Math.ceil(Math.log2(hashes.length))) - hashes.length;

  const padding = _.range(paddingLength).map(_i => sha3_256('0'));
  return [...hashes, ...padding];
}

export function generateWitness(hashes: Hash[], index: number): WitnessProof {
  const tree = new MerkleTree({hashType: 'SHA3-256'});
  tree.addLeaves(padLeaves(hashes), false);
  tree.makeTree();

  const root = tree.getMerkleRoot()?.toString('hex');
  const witness = tree.getLeaf(index)?.toString('hex');
  const proof = tree.getProof(index, false);

  if (!root || !witness || !proof) {
    throw new Error('Invalid node or proof!');
  }

  const nodes = proof.map(p => ('left' in p ? p.left : p.right));

  return {witness, nodes, index};
}

export function validateWitness(witnessProof: WitnessProof, root: string, depth: number): boolean {
  const tree = new MerkleTree({hashType: 'SHA3-256'});
  const {index, nodes, witness} = witnessProof;

  if (witnessProof.nodes.length !== depth) {
    throw new Error(
      `The witness provided is not for a leaf node. Expected ${depth} witness length, recieved ${witnessProof.nodes.length}`
    );
  }

  const convertedProof = generateMerkleToolsProof(nodes, index);
  return tree.validateProof(convertedProof, witness, root);
}

function generateMerkleToolsProof(nodes: Hash[], index: number): MerkleToolsProof<string> {
  const merkleToolsProof: MerkleToolsProof<string>[] = [];

  for (let i = 0; i < nodes.length; i++) {
    if (index % 2 !== 0) {
      merkleToolsProof.push({left: nodes[i]});
    } else {
      merkleToolsProof.push({right: nodes[i]});
    }

    index = Math.floor(index / 2);
  }

  // TODO: The MerkleTools library isn't typed properly so we force a cast here
  return merkleToolsProof as unknown as MerkleToolsProof<string>;
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
