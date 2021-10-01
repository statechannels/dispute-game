/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { MerkleHelper, MerkleHelperInterface } from "../MerkleHelper";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "leaves",
        type: "bytes32[]",
      },
    ],
    name: "generateRoot",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "consensusStep",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "disputedStep",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "numSplits",
        type: "uint256",
      },
    ],
    name: "getLeafIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "witness",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "index",
            type: "uint256",
          },
          {
            internalType: "bytes32[]",
            name: "nodes",
            type: "bytes32[]",
          },
        ],
        internalType: "struct WitnessProof",
        name: "proof",
        type: "tuple",
      },
      {
        internalType: "bytes32",
        name: "root",
        type: "bytes32",
      },
    ],
    name: "validateWitness",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x61105b610053600b82828239805160001a607314610046577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361061004b5760003560e01c80630ad682101461005057806365b428cc146100805780639898dc10146100b0575b600080fd5b61006a60048036038101906100659190610800565b6100e0565b6040516100779190610877565b60405180910390f35b61009a600480360381019061009591906108c8565b610219565b6040516100a7919061093e565b60405180910390f35b6100ca60048036038101906100c59190610ab2565b6102d9565b6040516100d79190610b0a565b60405180910390f35b6000808360000135905060008460200135905060005b8580604001906101069190610b34565b90508110156101f8576101188361042f565b60006002836101279190610bc6565b146101835785806040019061013c9190610b34565b8281811061014d5761014c610bf7565b5b9050602002013583604051602001610166929190610c47565b6040516020818303038152906040528051906020012092506101d6565b828680604001906101949190610b34565b838181106101a5576101a4610bf7565b5b905060200201356040516020016101bd929190610c47565b6040516020818303038152906040528051906020012092505b6002826101e39190610ca2565b915080806101f090610cd3565b9150506100f6565b508382141561020c57600192505050610213565b6000925050505b92915050565b600080851080610233575061022f8484846104c8565b8510155b15610273576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161026a90610d79565b60405180910390fd5b60016102808585856104c8565b61028a9190610d99565b851415610299578290506102d1565b60006102a6858585610512565b905060018110156102b657600190505b85816102c29190610dcd565b856102cd9190610e27565b9150505b949350505050565b6000806102e583610534565b905060006102f38251610649565b905060005b8181101561040957600081600261030f9190610fb0565b905060005b84518110156103f457600085828151811061033257610331610bf7565b5b60200260200101518684846103479190610e27565b8151811061035857610357610bf7565b5b6020026020010151604051602001610371929190610c47565b6040516020818303038152906040528051906020012090508086838151811061039d5761039c610bf7565b5b602002602001018181525050808684846103b79190610e27565b815181106103c8576103c7610bf7565b5b602002602001018181525050508160026103e29190610dcd565b816103ed9190610e27565b9050610314565b5050808061040190610cd3565b9150506102f8565b508160008151811061041e5761041d610bf7565b5b602002602001015192505050919050565b6104c581604051602401610443919061100a565b6040516020818303038152906040527f27b7cf85000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050610769565b50565b600060016104d7858585610512565b106104f0576001826104e99190610e27565b905061050b565b600184846104fe9190610d99565b6105089190610e27565b90505b9392505050565b60008184846105219190610d99565b61052b9190610ca2565b90509392505050565b606060006105428351610649565b600261054e9190610fb0565b905060008167ffffffffffffffff81111561056c5761056b61096f565b5b60405190808252806020026020018201604052801561059a5781602001602082028036833780820191505090505b50905060005b8281101561063e57845181116105ef578481815181106105c3576105c2610bf7565b5b60200260200101518282815181106105de576105dd610bf7565b5b60200260200101818152505061062b565b6040516020016040516020818303038152906040528051906020012082828151811061061e5761061d610bf7565b5b6020026020010181815250505b808061063690610cd3565b9150506105a0565b819350505050919050565b60008060009050700100000000000000000000000000000000831061067f57608083901c925060808161067c9190610e27565b90505b6801000000000000000083106106a657604083901c92506040816106a39190610e27565b90505b64010000000083106106c957602083901c92506020816106c69190610e27565b90505b6201000083106106ea57601083901c92506010816106e79190610e27565b90505b610100831061070a57600883901c92506008816107079190610e27565b90505b6010831061072957600483901c92506004816107269190610e27565b90505b6004831061074857600283901c92506002816107459190610e27565b90505b600283106107605760018161075d9190610e27565b90505b80915050919050565b60008151905060006a636f6e736f6c652e6c6f679050602083016000808483855afa5050505050565b6000604051905090565b600080fd5b600080fd5b600080fd5b6000606082840312156107c1576107c06107a6565b5b81905092915050565b6000819050919050565b6107dd816107ca565b81146107e857600080fd5b50565b6000813590506107fa816107d4565b92915050565b600080604083850312156108175761081661079c565b5b600083013567ffffffffffffffff811115610835576108346107a1565b5b610841858286016107ab565b9250506020610852858286016107eb565b9150509250929050565b60008115159050919050565b6108718161085c565b82525050565b600060208201905061088c6000830184610868565b92915050565b6000819050919050565b6108a581610892565b81146108b057600080fd5b50565b6000813590506108c28161089c565b92915050565b600080600080608085870312156108e2576108e161079c565b5b60006108f0878288016108b3565b9450506020610901878288016108b3565b9350506040610912878288016108b3565b9250506060610923878288016108b3565b91505092959194509250565b61093881610892565b82525050565b6000602082019050610953600083018461092f565b92915050565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6109a78261095e565b810181811067ffffffffffffffff821117156109c6576109c561096f565b5b80604052505050565b60006109d9610792565b90506109e5828261099e565b919050565b600067ffffffffffffffff821115610a0557610a0461096f565b5b602082029050602081019050919050565b600080fd5b6000610a2e610a29846109ea565b6109cf565b90508083825260208201905060208402830185811115610a5157610a50610a16565b5b835b81811015610a7a5780610a6688826107eb565b845260208401935050602081019050610a53565b5050509392505050565b600082601f830112610a9957610a98610959565b5b8135610aa9848260208601610a1b565b91505092915050565b600060208284031215610ac857610ac761079c565b5b600082013567ffffffffffffffff811115610ae657610ae56107a1565b5b610af284828501610a84565b91505092915050565b610b04816107ca565b82525050565b6000602082019050610b1f6000830184610afb565b92915050565b600080fd5b600080fd5b600080fd5b60008083356001602003843603038112610b5157610b50610b25565b5b80840192508235915067ffffffffffffffff821115610b7357610b72610b2a565b5b602083019250602082023603831315610b8f57610b8e610b2f565b5b509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6000610bd182610892565b9150610bdc83610892565b925082610bec57610beb610b97565b5b828206905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6000819050919050565b610c41610c3c826107ca565b610c26565b82525050565b6000610c538285610c30565b602082019150610c638284610c30565b6020820191508190509392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610cad82610892565b9150610cb883610892565b925082610cc857610cc7610b97565b5b828204905092915050565b6000610cde82610892565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415610d1157610d10610c73565b5b600182019050919050565b600082825260208201905092915050565b7f496e76616c696420696e64657800000000000000000000000000000000000000600082015250565b6000610d63600d83610d1c565b9150610d6e82610d2d565b602082019050919050565b60006020820190508181036000830152610d9281610d56565b9050919050565b6000610da482610892565b9150610daf83610892565b925082821015610dc257610dc1610c73565b5b828203905092915050565b6000610dd882610892565b9150610de383610892565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615610e1c57610e1b610c73565b5b828202905092915050565b6000610e3282610892565b9150610e3d83610892565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610e7257610e71610c73565b5b828201905092915050565b60008160011c9050919050565b6000808291508390505b6001851115610ed457808604811115610eb057610eaf610c73565b5b6001851615610ebf5780820291505b8081029050610ecd85610e7d565b9450610e94565b94509492505050565b600082610eed5760019050610fa9565b81610efb5760009050610fa9565b8160018114610f115760028114610f1b57610f4a565b6001915050610fa9565b60ff841115610f2d57610f2c610c73565b5b8360020a915084821115610f4457610f43610c73565b5b50610fa9565b5060208310610133831016604e8410600b8410161715610f7f5782820a905083811115610f7a57610f79610c73565b5b610fa9565b610f8c8484846001610e8a565b92509050818404811115610fa357610fa2610c73565b5b81810290505b9392505050565b6000610fbb82610892565b9150610fc683610892565b9250610ff37fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8484610edd565b905092915050565b611004816107ca565b82525050565b600060208201905061101f6000830184610ffb565b9291505056fea2646970667358221220a4cf98e4f5ac96216ac0e96926483c2c6b68b02d7959c3d4d9b61fbf1cc37d0664736f6c63430008090033";

export class MerkleHelper__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MerkleHelper> {
    return super.deploy(overrides || {}) as Promise<MerkleHelper>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): MerkleHelper {
    return super.attach(address) as MerkleHelper;
  }
  connect(signer: Signer): MerkleHelper__factory {
    return super.connect(signer) as MerkleHelper__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MerkleHelperInterface {
    return new utils.Interface(_abi) as MerkleHelperInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MerkleHelper {
    return new Contract(address, _abi, signerOrProvider) as MerkleHelper;
  }
}
