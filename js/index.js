import { createWalletClient, custom, createPublicClient, defineChain, parseEther } from "https://esm.sh/viem";
import { contractAddress, coffeeAbi } from "./constants-js.js";

// Playing around with the button
const button = document.getElementById("btn");
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById("ethAmount");
// const balanceButton = document.getElementById("balanceButton");

let publicClient; // New global variable
// Variable to hold the wallet client instance
let walletClient;

button.addEventListener("click", () => {
    window.location.href = "registration.html";
});

const connectButton = document.getElementById("btn2");

async function connect() {
    // inspect if Metamusk provider (window.ethereum) is available
    if (typeof(window.ethereum) !== "undefined") {
        console.log("MetaMask is installed!");

        try {
            // create a Wallet Client using viem's custom transport
            // this configures viem to use MetaMask's injected provider
            walletClient = createWalletClient({
                transport: custom(window.ethereum),
            });

            // request access to the user's account 
            // triggers MetaMusk conn prompt if not already authorized
            await walletClient.requestAddresses();
            
            // update trhe UI to indicate a successful connection
            connectButton.innerHTML = "Connected!";

            // now we I can use walletClient for further interactions
            // i.e. const accounts = await walletClient.getAddresses();
            // console.log("Connected accounts", accounts);
        } catch (error) {
            // handling potential errors
            console.error("Failed to connect: ", error);
            // connectButton.innerHTML = "Connection Failed";
            window.location.href = "wallet-conn-error.html";
        }

        // Extractiing contract's address and abi
        try {
            // We need to define contractAddress and contractAbi first!
            // We also need to parse ethAmount into Wei (e.g., using viem's parseEther)
        
            console.log("Attempting simulation...");
            const simulationResult = await publicClient.simulateContract({
                address: undefined, // TODO: Add deployed contract address
                abi: undefined,     // TODO: Add contract ABI
                functionName: 'fund',
                account: address,   // Use the address obtained from requestAddresses
                value: undefined,   // TODO: Add parsed ETH amount in Wei
            });
        
            console.log("Simulation successful:", simulationResult);
            // If simulation succeeds, simulationResult.request contains the prepared transaction details
            // We can then pass this to walletClient.writeContract() to send the actual transaction
        
        } catch (error) {
            console.error("Simulation failed:", error);
            // Handle simulation errors appropriately (e.g., display message to user)
        }

    } else {
        // Update UI if MetaMusk is not detected
        connectButton.innerHTML = "Please install MetaMusk!";
    }   
}

// Attatch connect function top the button's click event 
connectButton.onclick = connect;

// Logic for handeling the funding of our smart contract
async function fund() {
    const ethAmount = ethAmountInput.value; // grab value from input field
    console.log(`Funding with ${ethAmount}...`)

        // Ensure wallet is connected and client is initialized
    if (typeof window.ethereum !== "undefined") {
        // Re-initialize or confirm walletClient
        // Note: We assume 'walletClient' is declared globally (e.g., 'let walletClient;')
        walletClient = createWalletClient({
            transport: custom(window.ethereum),
        });
        // Request account access (important step!)
        const [address] = await walletClient.requestAddresses();
        console.log("Wallet connected, Account:", address);

        // Now we can proceed with transaction logic...

    } else {
        // Handle the case where MetaMask (or other provider) is not installed
        console.log("Please install MetaMask!");
        // Consider disabling the button or updating its text here
        // e.g., fundButton.innerHTML = "Please Install MetaMask";
    }

    // Contract interaction Promise
    await publicClient.simulateContract({
    address: contractAddress, // Specifies which contract to simulate on
    abi: coffeeAbi,         // Provides the contract interface definition
    // ... other parameters ...
    });

    // Fetch the connected accounts
    const accounts = await walletClient.requestAddresses();
    // Use array destructuring to get the first account
    const [connectedAccount] = accounts;

    // ... later in the simulateContract call ...

    await publicClient.simulateContract({
    // ... other parameters ...
    account: connectedAccount, // The account context for the simulation
    functionName: "fund",     // Specify the contract function to simulate
    // ... other parameters ...
    });

    // Helper function call
    // Get the defined chain object using the walletClient
    const currentChain = await getCurrentChain(walletClient);

    // ... later in the simulateContract call ...

    await publicClient.simulateContract({
    // ... other parameters ...
    chain: currentChain, // Pass the defined chain object for network context
    // ... other parameters ...
    });

    // Assume ethAmountInput is your HTML input element for the ETH amount

    // You can verify the conversion (optional):
    // console.log(`Converting ${ethAmount} ETH to Wei:`, parseEther(ethAmount));
    // Inputting "1" would log: 1000000000000000000n

    // ... later in the simulateContract call ...

    await publicClient.simulateContract({
    // ... other parameters ...
    value: parseEther(ethAmount), // Convert the Ether string to Wei BigInt
    });
}

fundButton.onclick = fund;
// balanceButton.onclick = getBalance; // Will add later

// Helper unction or identiying/ deining a speciic chain
async function getCurrentChain(client) {
  // Get the chain ID from the connected wallet client
  const chainId = await client.getChainId();

  // Define the chain parameters using viem's defineChain
  const currentChain = defineChain({
    id: chainId,
    name: "Local Devnet", // Provide a descriptive name (e.g., Anvil, Hardhat)
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      // Use the RPC URL of your local node
      default: { http: ["http://localhost:8545"] },
      // public: { http: ["http://localhost:8545"] }, // Optional: specify public RPC if different
    },
    // Add other chain-specific details if needed (e.g., blockExplorers)
  });
  return currentChain;
}