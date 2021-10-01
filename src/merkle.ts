import {ethers} from 'ethers';

import _ from 'lodash';

export type Hash = string;
export type WitnessProof = {
  witness: Hash;
  nodes: Hash[];
  index: number;
};

// Used to create a full binary tree.
function padLeaves(hashes: Hash[]) {
  const paddingLength = Math.pow(2, Math.ceil(Math.log2(hashes.length))) - hashes.length;

  const padding = _.range(paddingLength).map(_i => ethers.utils.keccak256('0x00'));
  return [...hashes, ...padding];
}

export function hash(value: string): Hash {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(value));
}

export function hashChildren(firstChild: Hash, secondChild: Hash): Hash {
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(['bytes32', 'bytes32'], [firstChild, secondChild])
  );
}

export function validateWitness(witnessProof: WitnessProof, root: string): boolean {
  const {nodes, witness} = witnessProof;

  let index = witnessProof.index;
  let hash = witness;
  for (let i = 0; i < nodes.length; i++) {
    if (index % 2 !== 0) {
      hash = hashChildren(nodes[i], hash);
    } else {
      hash = hashChildren(hash, nodes[i]);
    }

    index = Math.floor(index / 2);
  }

  return root === hash;
}

export function generateWitness(stateHashes: Hash[], index: number): WitnessProof {
  const witness = stateHashes[index];
  const originalIndex = index;
  const paddedLeaves = padLeaves(stateHashes);
  const nodes: Hash[] = [];
  const treeDepth = Math.floor(Math.log2(paddedLeaves.length));

  let currentNode = witness;
  for (let depth = 0; depth < treeDepth; depth++) {
    const offset = 2 ** depth;

    for (let i = 0; i < paddedLeaves.length; i = i + 2 * offset) {
      // if this is our current node want to get it's sibling
      // We then update our current node so we can keep tracking up the tree
      if (paddedLeaves[i + offset] === currentNode) {
        nodes.push(paddedLeaves[i]);
        currentNode = hashChildren(paddedLeaves[i], paddedLeaves[i + offset]);
      } else if (paddedLeaves[i] === currentNode) {
        nodes.push(paddedLeaves[i + offset]);
        currentNode = hashChildren(paddedLeaves[i], paddedLeaves[i + offset]);
      }

      const parentValue = hashChildren(paddedLeaves[i], paddedLeaves[i + offset]);

      paddedLeaves[i] = parentValue;
    }

    index = Math.floor(index / 2);
  }

  return {nodes, witness, index: originalIndex};
}
export function generateRoot(stateHashes: Hash[]): Hash {
  const paddedLeaves = padLeaves(stateHashes);
  const treeDepth = Math.floor(Math.log2(paddedLeaves.length));
  for (let depth = 0; depth < treeDepth; depth++) {
    const offset = 2 ** depth;

    for (let index = 0; index < paddedLeaves.length; index = index + 2 * offset) {
      const parentValue = hashChildren(paddedLeaves[index], paddedLeaves[index + offset]);

      paddedLeaves[index] = parentValue;
      paddedLeaves[index + offset] = parentValue;
    }
  }

  return paddedLeaves[0];
}
