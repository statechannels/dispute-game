/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BytesLike,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ChallengeManager,
  ChallengeManagerInterface,
} from "../ChallengeManager";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "_values",
        type: "bytes32[]",
      },
      {
        internalType: "uint256",
        name: "_numSteps",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_lastMover",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_splitFactor",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "currentStatus",
    outputs: [
      {
        internalType: "enum ChallengeStatus",
        name: "",
        type: "uint8",
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
        internalType: "string",
        name: "_mover",
        type: "string",
      },
    ],
    name: "fraudDetected",
    outputs: [],
    stateMutability: "nonpayable",
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
        name: "_consensusProof",
        type: "tuple",
      },
      {
        internalType: "bytes32[]",
        name: "_hashes",
        type: "bytes32[]",
      },
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
        name: "_disputedProof",
        type: "tuple",
      },
      {
        internalType: "string",
        name: "_mover",
        type: "string",
      },
    ],
    name: "split",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620028be380380620028be8339818101604052810190620000379190620005b0565b73__$e8bf4b85905b57662526b2fbe44c6720fc$__639898dc10856040518263ffffffff1660e01b81526004016200007091906200072e565b60206040518083038186803b1580156200008957600080fd5b505af41580156200009e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620000c4919062000752565b6000819055506001811162000110576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040162000107906200080b565b60405180910390fd5b600183101562000157576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016200014e90620008a3565b60405180910390fd5b600181620001669190620008f4565b845114620001ab576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620001a290620009a1565b60405180910390fd5b826002819055508160049080519060200190620001ca92919062000212565b508060018190555060006003819055506000600560006101000a81548160ff02191690836002811115620002035762000202620009c3565b5b02179055505050505062000a57565b828054620002209062000a21565b90600052602060002090601f01602090048101928262000244576000855562000290565b82601f106200025f57805160ff191683800117855562000290565b8280016001018555821562000290579182015b828111156200028f57825182559160200191906001019062000272565b5b5090506200029f9190620002a3565b5090565b5b80821115620002be576000816000905550600101620002a4565b5090565b6000604051905090565b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6200032682620002db565b810181811067ffffffffffffffff82111715620003485762000347620002ec565b5b80604052505050565b60006200035d620002c2565b90506200036b82826200031b565b919050565b600067ffffffffffffffff8211156200038e576200038d620002ec565b5b602082029050602081019050919050565b600080fd5b6000819050919050565b620003b981620003a4565b8114620003c557600080fd5b50565b600081519050620003d981620003ae565b92915050565b6000620003f6620003f08462000370565b62000351565b905080838252602082019050602084028301858111156200041c576200041b6200039f565b5b835b81811015620004495780620004348882620003c8565b8452602084019350506020810190506200041e565b5050509392505050565b600082601f8301126200046b576200046a620002d6565b5b81516200047d848260208601620003df565b91505092915050565b6000819050919050565b6200049b8162000486565b8114620004a757600080fd5b50565b600081519050620004bb8162000490565b92915050565b600080fd5b600067ffffffffffffffff821115620004e457620004e3620002ec565b5b620004ef82620002db565b9050602081019050919050565b60005b838110156200051c578082015181840152602081019050620004ff565b838111156200052c576000848401525b50505050565b6000620005496200054384620004c6565b62000351565b905082815260208101848484011115620005685762000567620004c1565b5b62000575848285620004fc565b509392505050565b600082601f830112620005955762000594620002d6565b5b8151620005a784826020860162000532565b91505092915050565b60008060008060808587031215620005cd57620005cc620002cc565b5b600085015167ffffffffffffffff811115620005ee57620005ed620002d1565b5b620005fc8782880162000453565b94505060206200060f87828801620004aa565b935050604085015167ffffffffffffffff811115620006335762000632620002d1565b5b62000641878288016200057d565b92505060606200065487828801620004aa565b91505092959194509250565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6200069781620003a4565b82525050565b6000620006ab83836200068c565b60208301905092915050565b6000602082019050919050565b6000620006d18262000660565b620006dd81856200066b565b9350620006ea836200067c565b8060005b83811015620007215781516200070588826200069d565b97506200071283620006b7565b925050600181019050620006ee565b5085935050505092915050565b600060208201905081810360008301526200074a8184620006c4565b905092915050565b6000602082840312156200076b576200076a620002cc565b5b60006200077b84828501620003c8565b91505092915050565b600082825260208201905092915050565b7f5468652073706c697474696e6720666163746f72206d7573742062652061626f60008201527f7665203100000000000000000000000000000000000000000000000000000000602082015250565b6000620007f360248362000784565b9150620008008262000795565b604082019050919050565b600060208201905081810360008301526200082681620007e4565b9050919050565b7f5468657265206d757374206265206174206c65617374206f6e6520656c656d6560008201527f6e74000000000000000000000000000000000000000000000000000000000000602082015250565b60006200088b60228362000784565b915062000898826200082d565b604082019050919050565b60006020820190508181036000830152620008be816200087c565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000620009018262000486565b91506200090e8362000486565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115620009465762000945620008c5565b5b828201905092915050565b7f5468657265206d757374206265206b2b312076616c7565730000000000000000600082015250565b60006200098960188362000784565b9150620009968262000951565b602082019050919050565b60006020820190508181036000830152620009bc816200097a565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168062000a3a57607f821691505b6020821081141562000a515762000a50620009f2565b5b50919050565b611e578062000a676000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80631e5520ac1461004657806334dbcbe914610062578063ef8a92351461007e575b600080fd5b610060600480360381019061005b9190610d43565b61009c565b005b61007c60048036038101906100779190610e58565b6104e9565b005b610086610621565b6040516100939190610f2f565b60405180910390f35b60046040516020016100ae9190611051565b6040516020818303038152906040528051906020012082826040516020016100d79291906110c0565b60405160208183030381529060405280519060200120141561012e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161012590611156565b60405180910390fd5b610136610634565b610175576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161016c906111c2565b60405180910390fd5b61019186610182906113e0565b8461018c906113e0565b6106cc565b826000013585856001888890506101a89190611422565b8181106101b8576101b7611456565b5b905060200201351415610200576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101f7906114f7565b60405180910390fd5b600061020f8760200135610831565b905060006102208560200135610831565b9050600180546102309190611422565b886020013514610256576102536001896020013561024e9190611517565b610831565b90505b6000600173__$e8bf4b85905b57662526b2fbe44c6720fc$__6372f57d8e85856001546040518463ffffffff1660e01b81526004016102979392919061157c565b60206040518083038186803b1580156102af57600080fd5b505af41580156102c3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102e791906115c8565b6102f19190611422565b9050808888905014610338576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161032f90611641565b60405180910390fd5b826003819055508160028190555060006001898990506103589190611517565b67ffffffffffffffff811115610371576103706111e7565b5b60405190808252806020026020018201604052801561039f5781602001602082028036833780820191505090505b5090508960000135816000815181106103bb576103ba611456565b5b6020026020010181815250506000600190505b60018a8a90506103de9190611517565b81101561043d5789896001836103f49190611422565b81811061040457610403611456565b5b9050602002013582828151811061041e5761041d611456565b5b602002602001018181525050808061043590611661565b9150506103ce565b5073__$e8bf4b85905b57662526b2fbe44c6720fc$__639898dc10826040518263ffffffff1660e01b81526004016104759190611768565b60206040518083038186803b15801561048d57600080fd5b505af41580156104a1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104c5919061179f565b6000819055508585600491906104dc929190610bad565b5050505050505050505050565b60046040516020016104fb9190611051565b6040516020818303038152906040528051906020012082826040516020016105249291906110c0565b60405160208183030381529060405280519060200120141561057b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161057290611156565b60405180910390fd5b600061059260018561058d9190611517565b610831565b9050600061059f85610831565b9050816001826105af9190611517565b146105ef576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105e690611818565b60405180910390fd5b6001600560006101000a81548160ff0219169083600281111561061557610614610eb8565b5b02179055505050505050565b600560009054906101000a900460ff1681565b600073__$e8bf4b85905b57662526b2fbe44c6720fc$__6363b4e3566003546002546001546040518463ffffffff1660e01b81526004016106779392919061157c565b60206040518083038186803b15801561068f57600080fd5b505af41580156106a3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106c79190611870565b905090565b60016106d66108cd565b6106e09190611422565b826020015110610725576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161071c9061190f565b60405180910390fd5b600061073b83600054610736610965565b6109b2565b90508061077d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107749061197b565b60405180910390fd5b60006107938360005461078e610965565b6109b2565b9050806107d5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107cc906119e7565b60405180910390fd5b8260200151600185602001516107eb9190611517565b1461082b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161082290611a9f565b60405180910390fd5b50505050565b600073__$e8bf4b85905b57662526b2fbe44c6720fc$__6365b428cc836003546002546001546040518563ffffffff1660e01b81526004016108769493929190611abf565b60206040518083038186803b15801561088e57600080fd5b505af41580156108a2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108c691906115c8565b9050919050565b600073__$e8bf4b85905b57662526b2fbe44c6720fc$__6372f57d8e6003546002546001546040518463ffffffff1660e01b81526004016109109392919061157c565b60206040518083038186803b15801561092857600080fd5b505af415801561093c573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061096091906115c8565b905090565b6000806109706108cd565b9050600061097d82610a8d565b90508181600261098d9190611c37565b141561099d5780925050506109af565b6001816109aa9190611517565b925050505b90565b600081846040015151146109fb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109f290611cf4565b60405180910390fd5b73__$e8bf4b85905b57662526b2fbe44c6720fc$__630ad6821085856040518363ffffffff1660e01b8152600401610a34929190611df1565b60206040518083038186803b158015610a4c57600080fd5b505af4158015610a60573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a849190611870565b90509392505050565b600080600090507001000000000000000000000000000000008310610ac357608083901c9250608081610ac09190611517565b90505b680100000000000000008310610aea57604083901c9250604081610ae79190611517565b90505b6401000000008310610b0d57602083901c9250602081610b0a9190611517565b90505b620100008310610b2e57601083901c9250601081610b2b9190611517565b90505b6101008310610b4e57600883901c9250600881610b4b9190611517565b90505b60108310610b6d57600483901c9250600481610b6a9190611517565b90505b60048310610b8c57600283901c9250600281610b899190611517565b90505b60028310610ba457600181610ba19190611517565b90505b80915050919050565b828054610bb990610f79565b90600052602060002090601f016020900481019282610bdb5760008555610c22565b82601f10610bf457803560ff1916838001178555610c22565b82800160010185558215610c22579182015b82811115610c21578235825591602001919060010190610c06565b5b509050610c2f9190610c33565b5090565b5b80821115610c4c576000816000905550600101610c34565b5090565b6000604051905090565b600080fd5b600080fd5b600080fd5b600060608284031215610c7f57610c7e610c64565b5b81905092915050565b600080fd5b600080fd5b600080fd5b60008083601f840112610cad57610cac610c88565b5b8235905067ffffffffffffffff811115610cca57610cc9610c8d565b5b602083019150836020820283011115610ce657610ce5610c92565b5b9250929050565b60008083601f840112610d0357610d02610c88565b5b8235905067ffffffffffffffff811115610d2057610d1f610c8d565b5b602083019150836001820283011115610d3c57610d3b610c92565b5b9250929050565b60008060008060008060808789031215610d6057610d5f610c5a565b5b600087013567ffffffffffffffff811115610d7e57610d7d610c5f565b5b610d8a89828a01610c69565b965050602087013567ffffffffffffffff811115610dab57610daa610c5f565b5b610db789828a01610c97565b9550955050604087013567ffffffffffffffff811115610dda57610dd9610c5f565b5b610de689828a01610c69565b935050606087013567ffffffffffffffff811115610e0757610e06610c5f565b5b610e1389828a01610ced565b92509250509295509295509295565b6000819050919050565b610e3581610e22565b8114610e4057600080fd5b50565b600081359050610e5281610e2c565b92915050565b600080600060408486031215610e7157610e70610c5a565b5b6000610e7f86828701610e43565b935050602084013567ffffffffffffffff811115610ea057610e9f610c5f565b5b610eac86828701610ced565b92509250509250925092565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60038110610ef857610ef7610eb8565b5b50565b6000819050610f0982610ee7565b919050565b6000610f1982610efb565b9050919050565b610f2981610f0e565b82525050565b6000602082019050610f446000830184610f20565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680610f9157607f821691505b60208210811415610fa557610fa4610f4a565b5b50919050565b600082825260208201905092915050565b60008190508160005260206000209050919050565b60008154610fde81610f79565b610fe88186610fab565b94506001821660008114611003576001811461101557611048565b60ff1983168652602086019350611048565b61101e85610fbc565b60005b8381101561104057815481890152600182019150602081019050611021565b808801955050505b50505092915050565b6000602082019050818103600083015261106b8184610fd1565b905092915050565b82818337600083830152505050565b6000601f19601f8301169050919050565b600061109f8385610fab565b93506110ac838584611073565b6110b583611082565b840190509392505050565b600060208201905081810360008301526110db818486611093565b90509392505050565b7f546865206d6f7665722063616e6e6f74206265207468652073616d652061732060008201527f746865206c617374206d6f766572000000000000000000000000000000000000602082015250565b6000611140602e83610fab565b915061114b826110e4565b604082019050919050565b6000602082019050818103600083015261116f81611133565b9050919050565b7f5374617465732063616e6e6f742062652073706c697420667572746865720000600082015250565b60006111ac601e83610fab565b91506111b782611176565b602082019050919050565b600060208201905081810360008301526111db8161119f565b9050919050565b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61121f82611082565b810181811067ffffffffffffffff8211171561123e5761123d6111e7565b5b80604052505050565b6000611251610c50565b905061125d8282611216565b919050565b600080fd5b6000819050919050565b61127a81611267565b811461128557600080fd5b50565b60008135905061129781611271565b92915050565b600067ffffffffffffffff8211156112b8576112b76111e7565b5b602082029050602081019050919050565b60006112dc6112d78461129d565b611247565b905080838252602082019050602084028301858111156112ff576112fe610c92565b5b835b8181101561132857806113148882611288565b845260208401935050602081019050611301565b5050509392505050565b600082601f83011261134757611346610c88565b5b81356113578482602086016112c9565b91505092915050565b600060608284031215611376576113756111e2565b5b6113806060611247565b9050600061139084828501611288565b60008301525060206113a484828501610e43565b602083015250604082013567ffffffffffffffff8111156113c8576113c7611262565b5b6113d484828501611332565b60408301525092915050565b60006113ec3683611360565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061142d82610e22565b915061143883610e22565b92508282101561144b5761144a6113f3565b5b828203905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f546865206c61737420737461746520737570706c696564206d7573742064696660008201527f6665722066726f6d20746865206469737075746564207769746e657373000000602082015250565b60006114e1603d83610fab565b91506114ec82611485565b604082019050919050565b60006020820190508181036000830152611510816114d4565b9050919050565b600061152282610e22565b915061152d83610e22565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115611562576115616113f3565b5b828201905092915050565b61157681610e22565b82525050565b6000606082019050611591600083018661156d565b61159e602083018561156d565b6115ab604083018461156d565b949350505050565b6000815190506115c281610e2c565b92915050565b6000602082840312156115de576115dd610c5a565b5b60006115ec848285016115b3565b91505092915050565b7f496e636f727265637420616d6f756e74206f6620737461746520686173686573600082015250565b600061162b602083610fab565b9150611636826115f5565b602082019050919050565b6000602082019050818103600083015261165a8161161e565b9050919050565b600061166c82610e22565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561169f5761169e6113f3565b5b600182019050919050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6116df81611267565b82525050565b60006116f183836116d6565b60208301905092915050565b6000602082019050919050565b6000611715826116aa565b61171f81856116b5565b935061172a836116c6565b8060005b8381101561175b57815161174288826116e5565b975061174d836116fd565b92505060018101905061172e565b5085935050505092915050565b60006020820190508181036000830152611782818461170a565b905092915050565b60008151905061179981611271565b92915050565b6000602082840312156117b5576117b4610c5a565b5b60006117c38482850161178a565b91505092915050565b7f4d757374206265207369626c696e67206e6f6465730000000000000000000000600082015250565b6000611802601583610fab565b915061180d826117cc565b602082019050919050565b60006020820190508181036000830152611831816117f5565b9050919050565b60008115159050919050565b61184d81611838565b811461185857600080fd5b50565b60008151905061186a81611844565b92915050565b60006020828403121561188657611885610c5a565b5b60006118948482850161185b565b91505092915050565b7f436f6e73656e737573207769746e6573732063616e6e6f74206265207468652060008201527f6c6173742073746f726564207374617465000000000000000000000000000000602082015250565b60006118f9603183610fab565b91506119048261189d565b604082019050919050565b60006020820190508181036000830152611928816118ec565b9050919050565b7f496e76616c696420636f6e73656e737573207769746e6573732070726f6f6600600082015250565b6000611965601f83610fab565b91506119708261192f565b602082019050919050565b6000602082019050818103600083015261199481611958565b9050919050565b7f496e76616c69642064697370757465207769746e6573732070726f6f66000000600082015250565b60006119d1601d83610fab565b91506119dc8261199b565b602082019050919050565b60006020820190508181036000830152611a00816119c4565b9050919050565b7f44697370757465642073746174652068617368206d757374206265207468652060008201527f6e657874206c65616620616674657220636f6e73656e7375732073746174652060208201527f6861736800000000000000000000000000000000000000000000000000000000604082015250565b6000611a89604483610fab565b9150611a9482611a07565b606082019050919050565b60006020820190508181036000830152611ab881611a7c565b9050919050565b6000608082019050611ad4600083018761156d565b611ae1602083018661156d565b611aee604083018561156d565b611afb606083018461156d565b95945050505050565b60008160011c9050919050565b6000808291508390505b6001851115611b5b57808604811115611b3757611b366113f3565b5b6001851615611b465780820291505b8081029050611b5485611b04565b9450611b1b565b94509492505050565b600082611b745760019050611c30565b81611b825760009050611c30565b8160018114611b985760028114611ba257611bd1565b6001915050611c30565b60ff841115611bb457611bb36113f3565b5b8360020a915084821115611bcb57611bca6113f3565b5b50611c30565b5060208310610133831016604e8410600b8410161715611c065782820a905083811115611c0157611c006113f3565b5b611c30565b611c138484846001611b11565b92509050818404811115611c2a57611c296113f3565b5b81810290505b9392505050565b6000611c4282610e22565b9150611c4d83610e22565b9250611c7a7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8484611b64565b905092915050565b7f546865207769746e6573732070726f7669646564206973206e6f7420666f722060008201527f61206c656166206e6f64652e0000000000000000000000000000000000000000602082015250565b6000611cde602c83610fab565b9150611ce982611c82565b604082019050919050565b60006020820190508181036000830152611d0d81611cd1565b9050919050565b611d1d81610e22565b82525050565b600082825260208201905092915050565b6000611d3f826116aa565b611d498185611d23565b9350611d54836116c6565b8060005b83811015611d85578151611d6c88826116e5565b9750611d77836116fd565b925050600181019050611d58565b5085935050505092915050565b6000606083016000830151611daa60008601826116d6565b506020830151611dbd6020860182611d14565b5060408301518482036040860152611dd58282611d34565b9150508091505092915050565b611deb81611267565b82525050565b60006040820190508181036000830152611e0b8185611d92565b9050611e1a6020830184611de2565b939250505056fea2646970667358221220967a5b1570f0d4f19ea69e4045e5aecc456c32a17deeaa4ffb6bc6253ffca8ec64736f6c63430008090033";

export class ChallengeManager__factory extends ContractFactory {
  constructor(
    linkLibraryAddresses: ChallengeManagerLibraryAddresses,
    signer?: Signer
  ) {
    super(
      _abi,
      ChallengeManager__factory.linkBytecode(linkLibraryAddresses),
      signer
    );
  }

  static linkBytecode(
    linkLibraryAddresses: ChallengeManagerLibraryAddresses
  ): string {
    let linkedBytecode = _bytecode;

    linkedBytecode = linkedBytecode.replace(
      new RegExp("__\\$e8bf4b85905b57662526b2fbe44c6720fc\\$__", "g"),
      linkLibraryAddresses["contracts/merkle-utils.sol:MerkleUtils"]
        .replace(/^0x/, "")
        .toLowerCase()
    );

    return linkedBytecode;
  }

  deploy(
    _values: BytesLike[],
    _numSteps: BigNumberish,
    _lastMover: string,
    _splitFactor: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ChallengeManager> {
    return super.deploy(
      _values,
      _numSteps,
      _lastMover,
      _splitFactor,
      overrides || {}
    ) as Promise<ChallengeManager>;
  }
  getDeployTransaction(
    _values: BytesLike[],
    _numSteps: BigNumberish,
    _lastMover: string,
    _splitFactor: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _values,
      _numSteps,
      _lastMover,
      _splitFactor,
      overrides || {}
    );
  }
  attach(address: string): ChallengeManager {
    return super.attach(address) as ChallengeManager;
  }
  connect(signer: Signer): ChallengeManager__factory {
    return super.connect(signer) as ChallengeManager__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ChallengeManagerInterface {
    return new utils.Interface(_abi) as ChallengeManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ChallengeManager {
    return new Contract(address, _abi, signerOrProvider) as ChallengeManager;
  }
}

export interface ChallengeManagerLibraryAddresses {
  ["contracts/merkle-utils.sol:MerkleUtils"]: string;
}
