
// This is a simplified representation of a smart contract ABI for milestone management
// In a production app, this would be generated from the actual Solidity contract

export const MilestoneContractABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_client",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_freelancer",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "milestoneId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "MilestoneCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "milestoneId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum MilestoneStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "name": "MilestoneStatusChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "milestoneId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "arbiter",
        "type": "address"
      }
    ],
    "name": "DisputeCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "createMilestone",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_milestoneId",
        "type": "uint256"
      }
    ],
    "name": "completeMilestone",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_milestoneId",
        "type": "uint256"
      }
    ],
    "name": "releaseFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_milestoneId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_arbiter",
        "type": "address"
      }
    ],
    "name": "createDispute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_milestoneId",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_releaseToFreelancer",
        "type": "bool"
      }
    ],
    "name": "resolveDispute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_milestoneId",
        "type": "uint256"
      }
    ],
    "name": "getMilestone",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "enum MilestoneStatus",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "bool",
            "name": "hasDispute",
            "type": "bool"
          }
        ],
        "internalType": "struct Milestone",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// This would be the address of the deployed contract
export const CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

// Helper function to simulate contract interaction (in a real app, this would use something like ethers.js)
export const simulateContractCall = async (
  method: string, 
  params: any[] = [], 
  waitTime: number = 1500
): Promise<any> => {
  return new Promise((resolve) => {
    console.log(`Simulating contract call: ${method}`, params);
    setTimeout(() => {
      resolve({ success: true, txHash: `0x${Math.random().toString(16).substring(2, 14)}` });
    }, waitTime);
  });
};
