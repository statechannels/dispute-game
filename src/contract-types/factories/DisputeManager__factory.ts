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
  DisputeManager,
  DisputeManagerInterface,
} from "../DisputeManager";

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
  "0x60806040523480156200001157600080fd5b50604051620022bd380380620022bd8339818101604052810190620000379190620005b0565b73__$3f210b973146c2d340e2bb2aba5bbea8b7$__639898dc10856040518263ffffffff1660e01b81526004016200007091906200072e565b60206040518083038186803b1580156200008957600080fd5b505af41580156200009e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620000c4919062000752565b6000819055506001811162000110576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040162000107906200080b565b60405180910390fd5b600183101562000157576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016200014e90620008a3565b60405180910390fd5b600181620001669190620008f4565b845114620001ab576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620001a290620009a1565b60405180910390fd5b826002819055508160049080519060200190620001ca92919062000212565b508060018190555060006003819055506000600560006101000a81548160ff02191690836002811115620002035762000202620009c3565b5b02179055505050505062000a57565b828054620002209062000a21565b90600052602060002090601f01602090048101928262000244576000855562000290565b82601f106200025f57805160ff191683800117855562000290565b8280016001018555821562000290579182015b828111156200028f57825182559160200191906001019062000272565b5b5090506200029f9190620002a3565b5090565b5b80821115620002be576000816000905550600101620002a4565b5090565b6000604051905090565b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6200032682620002db565b810181811067ffffffffffffffff82111715620003485762000347620002ec565b5b80604052505050565b60006200035d620002c2565b90506200036b82826200031b565b919050565b600067ffffffffffffffff8211156200038e576200038d620002ec565b5b602082029050602081019050919050565b600080fd5b6000819050919050565b620003b981620003a4565b8114620003c557600080fd5b50565b600081519050620003d981620003ae565b92915050565b6000620003f6620003f08462000370565b62000351565b905080838252602082019050602084028301858111156200041c576200041b6200039f565b5b835b81811015620004495780620004348882620003c8565b8452602084019350506020810190506200041e565b5050509392505050565b600082601f8301126200046b576200046a620002d6565b5b81516200047d848260208601620003df565b91505092915050565b6000819050919050565b6200049b8162000486565b8114620004a757600080fd5b50565b600081519050620004bb8162000490565b92915050565b600080fd5b600067ffffffffffffffff821115620004e457620004e3620002ec565b5b620004ef82620002db565b9050602081019050919050565b60005b838110156200051c578082015181840152602081019050620004ff565b838111156200052c576000848401525b50505050565b6000620005496200054384620004c6565b62000351565b905082815260208101848484011115620005685762000567620004c1565b5b62000575848285620004fc565b509392505050565b600082601f830112620005955762000594620002d6565b5b8151620005a784826020860162000532565b91505092915050565b60008060008060808587031215620005cd57620005cc620002cc565b5b600085015167ffffffffffffffff811115620005ee57620005ed620002d1565b5b620005fc8782880162000453565b94505060206200060f87828801620004aa565b935050604085015167ffffffffffffffff811115620006335762000632620002d1565b5b62000641878288016200057d565b92505060606200065487828801620004aa565b91505092959194509250565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6200069781620003a4565b82525050565b6000620006ab83836200068c565b60208301905092915050565b6000602082019050919050565b6000620006d18262000660565b620006dd81856200066b565b9350620006ea836200067c565b8060005b83811015620007215781516200070588826200069d565b97506200071283620006b7565b925050600181019050620006ee565b5085935050505092915050565b600060208201905081810360008301526200074a8184620006c4565b905092915050565b6000602082840312156200076b576200076a620002cc565b5b60006200077b84828501620003c8565b91505092915050565b600082825260208201905092915050565b7f5468652073706c697474696e6720666163746f72206d7573742062652061626f60008201527f7665203100000000000000000000000000000000000000000000000000000000602082015250565b6000620007f360248362000784565b9150620008008262000795565b604082019050919050565b600060208201905081810360008301526200082681620007e4565b9050919050565b7f5468657265206d757374206265206174206c65617374206f6e6520656c656d6560008201527f6e74000000000000000000000000000000000000000000000000000000000000602082015250565b60006200088b60228362000784565b915062000898826200082d565b604082019050919050565b60006020820190508181036000830152620008be816200087c565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000620009018262000486565b91506200090e8362000486565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115620009465762000945620008c5565b5b828201905092915050565b7f5468657265206d757374206265206b2b312076616c7565730000000000000000600082015250565b60006200098960188362000784565b9150620009968262000951565b602082019050919050565b60006020820190508181036000830152620009bc816200097a565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168062000a3a57607f821691505b6020821081141562000a515762000a50620009f2565b5b50919050565b6118568062000a676000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80631e5520ac1461003b57806331d802ea14610057575b600080fd5b610055600480360381019061005091906109eb565b610073565b005b610071600480360381019061006c9190610d0f565b6105a8565b005b60016100866003546002546001546107e9565b10156100c7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100be90610de4565b60405180910390fd5b3073ffffffffffffffffffffffffffffffffffffffff166331d802ea87856040518363ffffffff1660e01b8152600401610102929190610fad565b60006040518083038186803b15801561011a57600080fd5b505afa15801561012e573d6000803e3d6000fd5b50505050826000013585856001888890506101499190611013565b81811061015957610158611047565b5b9050602002013514156101a1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610198906110e8565b60405180910390fd5b600073__$3f210b973146c2d340e2bb2aba5bbea8b7$__6365b428cc88602001356003546002546001546040518563ffffffff1660e01b81526004016101ea9493929190611117565b60206040518083038186803b15801561020257600080fd5b505af4158015610216573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061023a9190611171565b9050600073__$3f210b973146c2d340e2bb2aba5bbea8b7$__6365b428cc86602001356003546002546001546040518563ffffffff1660e01b81526004016102859493929190611117565b60206040518083038186803b15801561029d57600080fd5b505af41580156102b1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102d59190611171565b9050600180546102e59190611013565b8860200135146103955773__$3f210b973146c2d340e2bb2aba5bbea8b7$__6365b428cc60018a6020013561031a919061119e565b6003546002546001546040518563ffffffff1660e01b81526004016103429493929190611117565b60206040518083038186803b15801561035a57600080fd5b505af415801561036e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103929190611171565b90505b600060016103a6848460015461080b565b6103b09190611013565b90508088889050146103f7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103ee90611240565b60405180910390fd5b82600381905550816002819055506000600189899050610417919061119e565b67ffffffffffffffff8111156104305761042f610ae0565b5b60405190808252806020026020018201604052801561045e5781602001602082028036833780820191505090505b50905089600001358160008151811061047a57610479611047565b5b6020026020010181815250506000600190505b60018a8a905061049d919061119e565b8110156104fc5789896001836104b39190611013565b8181106104c3576104c2611047565b5b905060200201358282815181106104dd576104dc611047565b5b60200260200101818152505080806104f490611260565b91505061048d565b5073__$3f210b973146c2d340e2bb2aba5bbea8b7$__639898dc10826040518263ffffffff1660e01b81526004016105349190611367565b60206040518083038186803b15801561054c57600080fd5b505af4158015610560573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610584919061139e565b60008190555085856004919061059b929190610855565b5050505050505050505050565b60018260200151106105ef576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105e69061143d565b60405180910390fd5b600073__$3f210b973146c2d340e2bb2aba5bbea8b7$__630ad68210846000546040518363ffffffff1660e01b815260040161062c92919061153a565b60206040518083038186803b15801561064457600080fd5b505af4158015610658573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061067c91906115a2565b9050806106be576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106b59061161b565b60405180910390fd5b600073__$3f210b973146c2d340e2bb2aba5bbea8b7$__630ad68210846000546040518363ffffffff1660e01b81526004016106fb92919061153a565b60206040518083038186803b15801561071357600080fd5b505af4158015610727573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061074b91906115a2565b90508061078d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161078490611687565b60405180910390fd5b8260200151600185602001516107a3919061119e565b146107e3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107da9061173f565b60405180910390fd5b50505050565b60008184846107f89190611013565b610802919061178e565b90509392505050565b6000600161081a8585856107e9565b106108335760018261082c919061119e565b905061084e565b600184846108419190611013565b61084b919061119e565b90505b9392505050565b828054610861906117ee565b90600052602060002090601f01602090048101928261088357600085556108ca565b82601f1061089c57803560ff19168380011785556108ca565b828001600101855582156108ca579182015b828111156108c95782358255916020019190600101906108ae565b5b5090506108d791906108db565b5090565b5b808211156108f45760008160009055506001016108dc565b5090565b6000604051905090565b600080fd5b600080fd5b600080fd5b6000606082840312156109275761092661090c565b5b81905092915050565b600080fd5b600080fd5b600080fd5b60008083601f84011261095557610954610930565b5b8235905067ffffffffffffffff81111561097257610971610935565b5b60208301915083602082028301111561098e5761098d61093a565b5b9250929050565b60008083601f8401126109ab576109aa610930565b5b8235905067ffffffffffffffff8111156109c8576109c7610935565b5b6020830191508360018202830111156109e4576109e361093a565b5b9250929050565b60008060008060008060808789031215610a0857610a07610902565b5b600087013567ffffffffffffffff811115610a2657610a25610907565b5b610a3289828a01610911565b965050602087013567ffffffffffffffff811115610a5357610a52610907565b5b610a5f89828a0161093f565b9550955050604087013567ffffffffffffffff811115610a8257610a81610907565b5b610a8e89828a01610911565b935050606087013567ffffffffffffffff811115610aaf57610aae610907565b5b610abb89828a01610995565b92509250509295509295509295565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b610b1882610acf565b810181811067ffffffffffffffff82111715610b3757610b36610ae0565b5b80604052505050565b6000610b4a6108f8565b9050610b568282610b0f565b919050565b600080fd5b6000819050919050565b610b7381610b60565b8114610b7e57600080fd5b50565b600081359050610b9081610b6a565b92915050565b6000819050919050565b610ba981610b96565b8114610bb457600080fd5b50565b600081359050610bc681610ba0565b92915050565b600067ffffffffffffffff821115610be757610be6610ae0565b5b602082029050602081019050919050565b6000610c0b610c0684610bcc565b610b40565b90508083825260208201905060208402830185811115610c2e57610c2d61093a565b5b835b81811015610c575780610c438882610b81565b845260208401935050602081019050610c30565b5050509392505050565b600082601f830112610c7657610c75610930565b5b8135610c86848260208601610bf8565b91505092915050565b600060608284031215610ca557610ca4610aca565b5b610caf6060610b40565b90506000610cbf84828501610b81565b6000830152506020610cd384828501610bb7565b602083015250604082013567ffffffffffffffff811115610cf757610cf6610b5b565b5b610d0384828501610c61565b60408301525092915050565b60008060408385031215610d2657610d25610902565b5b600083013567ffffffffffffffff811115610d4457610d43610907565b5b610d5085828601610c8f565b925050602083013567ffffffffffffffff811115610d7157610d70610907565b5b610d7d85828601610c8f565b9150509250929050565b600082825260208201905092915050565b7f5374617465732063616e6e6f742062652073706c697420667572746865720000600082015250565b6000610dce601e83610d87565b9150610dd982610d98565b602082019050919050565b60006020820190508181036000830152610dfd81610dc1565b9050919050565b6000610e136020840184610b81565b905092915050565b610e2481610b60565b82525050565b6000610e396020840184610bb7565b905092915050565b610e4a81610b96565b82525050565b600080fd5b600080fd5b600080fd5b60008083356001602003843603038112610e7c57610e7b610e5a565b5b83810192508235915060208301925067ffffffffffffffff821115610ea457610ea3610e50565b5b602082023603841315610eba57610eb9610e55565b5b509250929050565b600082825260208201905092915050565b600080fd5b82818337600083830152505050565b6000610ef38385610ec2565b93507f07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff831115610f2657610f25610ed3565b5b602083029250610f37838584610ed8565b82840190509392505050565b600060608301610f566000840184610e04565b610f636000860182610e1b565b50610f716020840184610e2a565b610f7e6020860182610e41565b50610f8c6040840184610e5f565b8583036040870152610f9f838284610ee7565b925050508091505092915050565b60006040820190508181036000830152610fc78185610f43565b90508181036020830152610fdb8184610f43565b90509392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061101e82610b96565b915061102983610b96565b92508282101561103c5761103b610fe4565b5b828203905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f546865206c61737420737461746520737570706c696564206d7573742064696660008201527f6665722066726f6d20746865206469737075746564207769746e657373000000602082015250565b60006110d2603d83610d87565b91506110dd82611076565b604082019050919050565b60006020820190508181036000830152611101816110c5565b9050919050565b61111181610b96565b82525050565b600060808201905061112c6000830187611108565b6111396020830186611108565b6111466040830185611108565b6111536060830184611108565b95945050505050565b60008151905061116b81610ba0565b92915050565b60006020828403121561118757611186610902565b5b60006111958482850161115c565b91505092915050565b60006111a982610b96565b91506111b483610b96565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156111e9576111e8610fe4565b5b828201905092915050565b7f496e636f727265637420616d6f756e74206f6620737461746520686173686573600082015250565b600061122a602083610d87565b9150611235826111f4565b602082019050919050565b600060208201905081810360008301526112598161121d565b9050919050565b600061126b82610b96565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561129e5761129d610fe4565b5b600182019050919050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6112de81610b60565b82525050565b60006112f083836112d5565b60208301905092915050565b6000602082019050919050565b6000611314826112a9565b61131e81856112b4565b9350611329836112c5565b8060005b8381101561135a57815161134188826112e4565b975061134c836112fc565b92505060018101905061132d565b5085935050505092915050565b600060208201905081810360008301526113818184611309565b905092915050565b60008151905061139881610b6a565b92915050565b6000602082840312156113b4576113b3610902565b5b60006113c284828501611389565b91505092915050565b7f436f6e73656e737573207769746e6573732063616e6e6f74206265207468652060008201527f6c6173742073746f726564207374617465000000000000000000000000000000602082015250565b6000611427603183610d87565b9150611432826113cb565b604082019050919050565b600060208201905081810360008301526114568161141a565b9050919050565b61146681610b96565b82525050565b600082825260208201905092915050565b6000611488826112a9565b611492818561146c565b935061149d836112c5565b8060005b838110156114ce5781516114b588826112e4565b97506114c0836112fc565b9250506001810190506114a1565b5085935050505092915050565b60006060830160008301516114f360008601826112d5565b506020830151611506602086018261145d565b506040830151848203604086015261151e828261147d565b9150508091505092915050565b61153481610b60565b82525050565b6000604082019050818103600083015261155481856114db565b9050611563602083018461152b565b9392505050565b60008115159050919050565b61157f8161156a565b811461158a57600080fd5b50565b60008151905061159c81611576565b92915050565b6000602082840312156115b8576115b7610902565b5b60006115c68482850161158d565b91505092915050565b7f496e76616c696420636f6e73656e737573207769746e6573732070726f6f6600600082015250565b6000611605601f83610d87565b9150611610826115cf565b602082019050919050565b60006020820190508181036000830152611634816115f8565b9050919050565b7f496e76616c69642064697370757465207769746e6573732070726f6f66000000600082015250565b6000611671601d83610d87565b915061167c8261163b565b602082019050919050565b600060208201905081810360008301526116a081611664565b9050919050565b7f44697370757465642073746174652068617368206d757374206265207468652060008201527f6e657874206c65616620616674657220636f6e73656e7375732073746174652060208201527f6861736800000000000000000000000000000000000000000000000000000000604082015250565b6000611729604483610d87565b9150611734826116a7565b606082019050919050565b600060208201905081810360008301526117588161171c565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b600061179982610b96565b91506117a483610b96565b9250826117b4576117b361175f565b5b828204905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061180657607f821691505b6020821081141561181a576118196117bf565b5b5091905056fea2646970667358221220c113592edf2bd5a5925d5237dd1979b8dbb181d49d6324ee8cc440550105987564736f6c63430008090033";

export class DisputeManager__factory extends ContractFactory {
  constructor(
    linkLibraryAddresses: DisputeManagerLibraryAddresses,
    signer?: Signer
  ) {
    super(
      _abi,
      DisputeManager__factory.linkBytecode(linkLibraryAddresses),
      signer
    );
  }

  static linkBytecode(
    linkLibraryAddresses: DisputeManagerLibraryAddresses
  ): string {
    let linkedBytecode = _bytecode;

    linkedBytecode = linkedBytecode.replace(
      new RegExp("__\\$3f210b973146c2d340e2bb2aba5bbea8b7\\$__", "g"),
      linkLibraryAddresses["contracts/merkle.sol:MerkleHelper"]
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
  ): Promise<DisputeManager> {
    return super.deploy(
      _values,
      _numSteps,
      _lastMover,
      _splitFactor,
      overrides || {}
    ) as Promise<DisputeManager>;
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
  attach(address: string): DisputeManager {
    return super.attach(address) as DisputeManager;
  }
  connect(signer: Signer): DisputeManager__factory {
    return super.connect(signer) as DisputeManager__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DisputeManagerInterface {
    return new utils.Interface(_abi) as DisputeManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DisputeManager {
    return new Contract(address, _abi, signerOrProvider) as DisputeManager;
  }
}

export interface DisputeManagerLibraryAddresses {
  ["contracts/merkle.sol:MerkleHelper"]: string;
}
