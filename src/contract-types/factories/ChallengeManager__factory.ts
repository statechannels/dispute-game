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
        name: "consensusProof",
        type: "tuple",
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
        name: "disputedProof",
        type: "tuple",
      },
    ],
    name: "checkWitnesses",
    outputs: [],
    stateMutability: "view",
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
  "0x60806040523480156200001157600080fd5b50604051620023c5380380620023c58339818101604052810190620000379190620005b0565b73__$e8bf4b85905b57662526b2fbe44c6720fc$__639898dc10856040518263ffffffff1660e01b81526004016200007091906200072e565b60206040518083038186803b1580156200008957600080fd5b505af41580156200009e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620000c4919062000752565b6000819055506001811162000110576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040162000107906200080b565b60405180910390fd5b600183101562000157576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016200014e90620008a3565b60405180910390fd5b600181620001669190620008f4565b845114620001ab576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620001a290620009a1565b60405180910390fd5b826002819055508160049080519060200190620001ca92919062000212565b508060018190555060006003819055506000600560006101000a81548160ff02191690836002811115620002035762000202620009c3565b5b02179055505050505062000a57565b828054620002209062000a21565b90600052602060002090601f01602090048101928262000244576000855562000290565b82601f106200025f57805160ff191683800117855562000290565b8280016001018555821562000290579182015b828111156200028f57825182559160200191906001019062000272565b5b5090506200029f9190620002a3565b5090565b5b80821115620002be576000816000905550600101620002a4565b5090565b6000604051905090565b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6200032682620002db565b810181811067ffffffffffffffff82111715620003485762000347620002ec565b5b80604052505050565b60006200035d620002c2565b90506200036b82826200031b565b919050565b600067ffffffffffffffff8211156200038e576200038d620002ec565b5b602082029050602081019050919050565b600080fd5b6000819050919050565b620003b981620003a4565b8114620003c557600080fd5b50565b600081519050620003d981620003ae565b92915050565b6000620003f6620003f08462000370565b62000351565b905080838252602082019050602084028301858111156200041c576200041b6200039f565b5b835b81811015620004495780620004348882620003c8565b8452602084019350506020810190506200041e565b5050509392505050565b600082601f8301126200046b576200046a620002d6565b5b81516200047d848260208601620003df565b91505092915050565b6000819050919050565b6200049b8162000486565b8114620004a757600080fd5b50565b600081519050620004bb8162000490565b92915050565b600080fd5b600067ffffffffffffffff821115620004e457620004e3620002ec565b5b620004ef82620002db565b9050602081019050919050565b60005b838110156200051c578082015181840152602081019050620004ff565b838111156200052c576000848401525b50505050565b6000620005496200054384620004c6565b62000351565b905082815260208101848484011115620005685762000567620004c1565b5b62000575848285620004fc565b509392505050565b600082601f830112620005955762000594620002d6565b5b8151620005a784826020860162000532565b91505092915050565b60008060008060808587031215620005cd57620005cc620002cc565b5b600085015167ffffffffffffffff811115620005ee57620005ed620002d1565b5b620005fc8782880162000453565b94505060206200060f87828801620004aa565b935050604085015167ffffffffffffffff811115620006335762000632620002d1565b5b62000641878288016200057d565b92505060606200065487828801620004aa565b91505092959194509250565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6200069781620003a4565b82525050565b6000620006ab83836200068c565b60208301905092915050565b6000602082019050919050565b6000620006d18262000660565b620006dd81856200066b565b9350620006ea836200067c565b8060005b83811015620007215781516200070588826200069d565b97506200071283620006b7565b925050600181019050620006ee565b5085935050505092915050565b600060208201905081810360008301526200074a8184620006c4565b905092915050565b6000602082840312156200076b576200076a620002cc565b5b60006200077b84828501620003c8565b91505092915050565b600082825260208201905092915050565b7f5468652073706c697474696e6720666163746f72206d7573742062652061626f60008201527f7665203100000000000000000000000000000000000000000000000000000000602082015250565b6000620007f360248362000784565b9150620008008262000795565b604082019050919050565b600060208201905081810360008301526200082681620007e4565b9050919050565b7f5468657265206d757374206265206174206c65617374206f6e6520656c656d6560008201527f6e74000000000000000000000000000000000000000000000000000000000000602082015250565b60006200088b60228362000784565b915062000898826200082d565b604082019050919050565b60006020820190508181036000830152620008be816200087c565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000620009018262000486565b91506200090e8362000486565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115620009465762000945620008c5565b5b828201905092915050565b7f5468657265206d757374206265206b2b312076616c7565730000000000000000600082015250565b60006200098960188362000784565b9150620009968262000951565b602082019050919050565b60006020820190508181036000830152620009bc816200097a565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168062000a3a57607f821691505b6020821081141562000a515762000a50620009f2565b5b50919050565b61195e8062000a676000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80631e5520ac1461003b57806331d802ea14610057575b600080fd5b61005560048036038101906100509190610abc565b610073565b005b610071600480360381019061006c9190610de0565b610628565b005b6001610086600354600254600154610904565b10156100c7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100be90610eb5565b60405180910390fd5b3073ffffffffffffffffffffffffffffffffffffffff166331d802ea87856040518363ffffffff1660e01b815260040161010292919061107e565b60006040518083038186803b15801561011a57600080fd5b505afa15801561012e573d6000803e3d6000fd5b505050508260000135858560018888905061014991906110e4565b81811061015957610158611118565b5b9050602002013514156101a1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610198906111b9565b60405180910390fd5b600073__$e8bf4b85905b57662526b2fbe44c6720fc$__6365b428cc88602001356003546002546001546040518563ffffffff1660e01b81526004016101ea94939291906111e8565b60206040518083038186803b15801561020257600080fd5b505af4158015610216573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061023a9190611242565b9050600073__$e8bf4b85905b57662526b2fbe44c6720fc$__6365b428cc86602001356003546002546001546040518563ffffffff1660e01b815260040161028594939291906111e8565b60206040518083038186803b15801561029d57600080fd5b505af41580156102b1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102d59190611242565b9050600180546102e591906110e4565b8860200135146103955773__$e8bf4b85905b57662526b2fbe44c6720fc$__6365b428cc60018a6020013561031a919061126f565b6003546002546001546040518563ffffffff1660e01b815260040161034294939291906111e8565b60206040518083038186803b15801561035a57600080fd5b505af415801561036e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103929190611242565b90505b6000600173__$e8bf4b85905b57662526b2fbe44c6720fc$__6372f57d8e85856001546040518463ffffffff1660e01b81526004016103d6939291906112c5565b60206040518083038186803b1580156103ee57600080fd5b505af4158015610402573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104269190611242565b61043091906110e4565b9050808888905014610477576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161046e90611348565b60405180910390fd5b82600381905550816002819055506000600189899050610497919061126f565b67ffffffffffffffff8111156104b0576104af610bb1565b5b6040519080825280602002602001820160405280156104de5781602001602082028036833780820191505090505b5090508960000135816000815181106104fa576104f9611118565b5b6020026020010181815250506000600190505b60018a8a905061051d919061126f565b81101561057c57898960018361053391906110e4565b81811061054357610542611118565b5b9050602002013582828151811061055d5761055c611118565b5b602002602001018181525050808061057490611368565b91505061050d565b5073__$e8bf4b85905b57662526b2fbe44c6720fc$__639898dc10826040518263ffffffff1660e01b81526004016105b4919061146f565b60206040518083038186803b1580156105cc57600080fd5b505af41580156105e0573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061060491906114a6565b60008190555085856004919061061b929190610926565b5050505050505050505050565b600173__$e8bf4b85905b57662526b2fbe44c6720fc$__6372f57d8e6003546002546001546040518463ffffffff1660e01b815260040161066b939291906112c5565b60206040518083038186803b15801561068357600080fd5b505af4158015610697573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106bb9190611242565b6106c591906110e4565b82602001511061070a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161070190611545565b60405180910390fd5b600073__$e8bf4b85905b57662526b2fbe44c6720fc$__630ad68210846000546040518363ffffffff1660e01b8152600401610747929190611642565b60206040518083038186803b15801561075f57600080fd5b505af4158015610773573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061079791906116aa565b9050806107d9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107d090611723565b60405180910390fd5b600073__$e8bf4b85905b57662526b2fbe44c6720fc$__630ad68210846000546040518363ffffffff1660e01b8152600401610816929190611642565b60206040518083038186803b15801561082e57600080fd5b505af4158015610842573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061086691906116aa565b9050806108a8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161089f9061178f565b60405180910390fd5b8260200151600185602001516108be919061126f565b146108fe576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108f590611847565b60405180910390fd5b50505050565b600081848461091391906110e4565b61091d9190611896565b90509392505050565b828054610932906118f6565b90600052602060002090601f016020900481019282610954576000855561099b565b82601f1061096d57803560ff191683800117855561099b565b8280016001018555821561099b579182015b8281111561099a57823582559160200191906001019061097f565b5b5090506109a891906109ac565b5090565b5b808211156109c55760008160009055506001016109ad565b5090565b6000604051905090565b600080fd5b600080fd5b600080fd5b6000606082840312156109f8576109f76109dd565b5b81905092915050565b600080fd5b600080fd5b600080fd5b60008083601f840112610a2657610a25610a01565b5b8235905067ffffffffffffffff811115610a4357610a42610a06565b5b602083019150836020820283011115610a5f57610a5e610a0b565b5b9250929050565b60008083601f840112610a7c57610a7b610a01565b5b8235905067ffffffffffffffff811115610a9957610a98610a06565b5b602083019150836001820283011115610ab557610ab4610a0b565b5b9250929050565b60008060008060008060808789031215610ad957610ad86109d3565b5b600087013567ffffffffffffffff811115610af757610af66109d8565b5b610b0389828a016109e2565b965050602087013567ffffffffffffffff811115610b2457610b236109d8565b5b610b3089828a01610a10565b9550955050604087013567ffffffffffffffff811115610b5357610b526109d8565b5b610b5f89828a016109e2565b935050606087013567ffffffffffffffff811115610b8057610b7f6109d8565b5b610b8c89828a01610a66565b92509250509295509295509295565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b610be982610ba0565b810181811067ffffffffffffffff82111715610c0857610c07610bb1565b5b80604052505050565b6000610c1b6109c9565b9050610c278282610be0565b919050565b600080fd5b6000819050919050565b610c4481610c31565b8114610c4f57600080fd5b50565b600081359050610c6181610c3b565b92915050565b6000819050919050565b610c7a81610c67565b8114610c8557600080fd5b50565b600081359050610c9781610c71565b92915050565b600067ffffffffffffffff821115610cb857610cb7610bb1565b5b602082029050602081019050919050565b6000610cdc610cd784610c9d565b610c11565b90508083825260208201905060208402830185811115610cff57610cfe610a0b565b5b835b81811015610d285780610d148882610c52565b845260208401935050602081019050610d01565b5050509392505050565b600082601f830112610d4757610d46610a01565b5b8135610d57848260208601610cc9565b91505092915050565b600060608284031215610d7657610d75610b9b565b5b610d806060610c11565b90506000610d9084828501610c52565b6000830152506020610da484828501610c88565b602083015250604082013567ffffffffffffffff811115610dc857610dc7610c2c565b5b610dd484828501610d32565b60408301525092915050565b60008060408385031215610df757610df66109d3565b5b600083013567ffffffffffffffff811115610e1557610e146109d8565b5b610e2185828601610d60565b925050602083013567ffffffffffffffff811115610e4257610e416109d8565b5b610e4e85828601610d60565b9150509250929050565b600082825260208201905092915050565b7f5374617465732063616e6e6f742062652073706c697420667572746865720000600082015250565b6000610e9f601e83610e58565b9150610eaa82610e69565b602082019050919050565b60006020820190508181036000830152610ece81610e92565b9050919050565b6000610ee46020840184610c52565b905092915050565b610ef581610c31565b82525050565b6000610f0a6020840184610c88565b905092915050565b610f1b81610c67565b82525050565b600080fd5b600080fd5b600080fd5b60008083356001602003843603038112610f4d57610f4c610f2b565b5b83810192508235915060208301925067ffffffffffffffff821115610f7557610f74610f21565b5b602082023603841315610f8b57610f8a610f26565b5b509250929050565b600082825260208201905092915050565b600080fd5b82818337600083830152505050565b6000610fc48385610f93565b93507f07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff831115610ff757610ff6610fa4565b5b602083029250611008838584610fa9565b82840190509392505050565b6000606083016110276000840184610ed5565b6110346000860182610eec565b506110426020840184610efb565b61104f6020860182610f12565b5061105d6040840184610f30565b8583036040870152611070838284610fb8565b925050508091505092915050565b600060408201905081810360008301526110988185611014565b905081810360208301526110ac8184611014565b90509392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006110ef82610c67565b91506110fa83610c67565b92508282101561110d5761110c6110b5565b5b828203905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f546865206c61737420737461746520737570706c696564206d7573742064696660008201527f6665722066726f6d20746865206469737075746564207769746e657373000000602082015250565b60006111a3603d83610e58565b91506111ae82611147565b604082019050919050565b600060208201905081810360008301526111d281611196565b9050919050565b6111e281610c67565b82525050565b60006080820190506111fd60008301876111d9565b61120a60208301866111d9565b61121760408301856111d9565b61122460608301846111d9565b95945050505050565b60008151905061123c81610c71565b92915050565b600060208284031215611258576112576109d3565b5b60006112668482850161122d565b91505092915050565b600061127a82610c67565b915061128583610c67565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156112ba576112b96110b5565b5b828201905092915050565b60006060820190506112da60008301866111d9565b6112e760208301856111d9565b6112f460408301846111d9565b949350505050565b7f496e636f727265637420616d6f756e74206f6620737461746520686173686573600082015250565b6000611332602083610e58565b915061133d826112fc565b602082019050919050565b6000602082019050818103600083015261136181611325565b9050919050565b600061137382610c67565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156113a6576113a56110b5565b5b600182019050919050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6113e681610c31565b82525050565b60006113f883836113dd565b60208301905092915050565b6000602082019050919050565b600061141c826113b1565b61142681856113bc565b9350611431836113cd565b8060005b8381101561146257815161144988826113ec565b975061145483611404565b925050600181019050611435565b5085935050505092915050565b600060208201905081810360008301526114898184611411565b905092915050565b6000815190506114a081610c3b565b92915050565b6000602082840312156114bc576114bb6109d3565b5b60006114ca84828501611491565b91505092915050565b7f436f6e73656e737573207769746e6573732063616e6e6f74206265207468652060008201527f6c6173742073746f726564207374617465000000000000000000000000000000602082015250565b600061152f603183610e58565b915061153a826114d3565b604082019050919050565b6000602082019050818103600083015261155e81611522565b9050919050565b61156e81610c67565b82525050565b600082825260208201905092915050565b6000611590826113b1565b61159a8185611574565b93506115a5836113cd565b8060005b838110156115d65781516115bd88826113ec565b97506115c883611404565b9250506001810190506115a9565b5085935050505092915050565b60006060830160008301516115fb60008601826113dd565b50602083015161160e6020860182611565565b50604083015184820360408601526116268282611585565b9150508091505092915050565b61163c81610c31565b82525050565b6000604082019050818103600083015261165c81856115e3565b905061166b6020830184611633565b9392505050565b60008115159050919050565b61168781611672565b811461169257600080fd5b50565b6000815190506116a48161167e565b92915050565b6000602082840312156116c0576116bf6109d3565b5b60006116ce84828501611695565b91505092915050565b7f496e76616c696420636f6e73656e737573207769746e6573732070726f6f6600600082015250565b600061170d601f83610e58565b9150611718826116d7565b602082019050919050565b6000602082019050818103600083015261173c81611700565b9050919050565b7f496e76616c69642064697370757465207769746e6573732070726f6f66000000600082015250565b6000611779601d83610e58565b915061178482611743565b602082019050919050565b600060208201905081810360008301526117a88161176c565b9050919050565b7f44697370757465642073746174652068617368206d757374206265207468652060008201527f6e657874206c65616620616674657220636f6e73656e7375732073746174652060208201527f6861736800000000000000000000000000000000000000000000000000000000604082015250565b6000611831604483610e58565b915061183c826117af565b606082019050919050565b6000602082019050818103600083015261186081611824565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b60006118a182610c67565b91506118ac83610c67565b9250826118bc576118bb611867565b5b828204905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061190e57607f821691505b60208210811415611922576119216118c7565b5b5091905056fea2646970667358221220f3b7472ece7a90be1b68bbec81cd50e3b0278c6c49d045855e3a4d3940c99a3664736f6c63430008090033";

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
