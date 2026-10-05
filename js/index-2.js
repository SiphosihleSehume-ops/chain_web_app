import { createWalletClient, custom, createPublicClient, defineChain, parseEther } from "https://esm.sh/viem";
import { contractAddress, coffeeAbi } from "./constants-js.js";

// Playing around with the button
const button = document.getElementById("btn");
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById("ethAmount");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");

let publicClient; // New global variable
// Variable to hold the wallet client instance
let walletClient;

button.addEventListener("click", () => {
    window.location.href = "registration.html";
});

balanceButton.onclick = getBalance;

const connectButton = document.getElementById("btn2");

async function connect() {
    // inspect if Metamusk provider (window.ethereum) is available
    if (typeof(window.ethereum) !== "undefined") {
        console.log("MetaMask is installed!");

        try {
            // Enable viem to inject Metamask
            walletClient = createWalletClient({
                transport: custom(window.ethereum),
            });

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
            console.log("Attempting simulation...");
            const simulationResult = await publicClient.simulateContract({
                address: undefined, // TODO: Add deployed contract address
                abi: undefined,     // TODO: Add contract ABI
                functionName: 'fund',
                account: address,   // Use the address obtained from requestAddresses
                value: undefined,   // TODO: Add parsed ETH amount in Wei
            });
        
            // console.log("Simulation successful:", simulationResult);
        
        } catch (error) {
            console.error("Simulation failed:", error);
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

async function getBalance() {
    // Check if a browser Ethereum provider (like MetaMask) is available
    if (typeof window.ethereum !== "undefined") {
        // Create a Public Client using viem
        // This client is used for read-only interactions
        const publicClient = createPublicClient({
            // Connects viem to the browser's Ethereum provider (e.g., MetaMask)
            transport: custom(window.ethereum)
        });
        
        try {
            // Use the publicClient to fetch the balance of the specified address
            const balance = await publicClient.getBalance({
                address: contractAddress // The address of the smart contract
            });

            // The balance is returned in Wei as a BigInt
            // Format it into Ether for user-friendly display
            const formattedBalance = formatEther(balance);

            // Log the formatted balance to the console
            console.log(`Contract Balance: ${formattedBalance} ETH`);
            // You could update a UI element here instead of logging

        } catch (error) {
            // Handle potential errors during the asynchronous call
            console.error("Error getting balance:", error);
        }
    } else {
        // Inform the user if MetaMask or another provider isn't installed
        console.log("Please install MetaMask!");
        // Update the UI to prompt installation if desired
    }

}

// Withdraw function

withdrawButton.onclick = withdraw;