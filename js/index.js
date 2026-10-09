import {
    createWalletClient,
    custom,
    createPublicClient,
    defineChain,
    parseEther,
    formatEther,
} from "viem";

import { contractAddress, coffeeAbi } from "./constants-js.js";

// Playing around with the button
const button = document.getElementById("btn");
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById(
    "ethAmount"
) as HTMLInputElement | null;
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");

let publicClient: ReturnType<typeof createPublicClient>;
let walletClient: ReturnType<typeof createWalletClient>;

// Extend the Window interface to include MetaMask's provider
declare global {
    interface Window {
        ethereum?: import("viem").EIP1193Provider;
    }
}

button?.addEventListener("click", () => {
    window.location.href = "registration.html";
});

balanceButton?.addEventListener("click", () => {
    void getBalance();
});

const connectButton = document.getElementById("btn2");

async function connect(): Promise<void> {
    // Inspect if MetaMask provider (window.ethereum) is available
    if (typeof window.ethereum !== "undefined") {
        console.log("MetaMask is installed!");

        try {
            // Enable Viem to inject MetaMask
            walletClient = createWalletClient({
                transport: custom(window.ethereum),
            });

            await walletClient.requestAddresses();

            // Update the UI to indicate a successful connection
            if (connectButton) {
                connectButton.innerHTML = "Connected!";
            }

            // Now we can use walletClient for further interactions
        } catch (error: unknown) {
            // Handling potential errors
            console.error("Failed to connect: ", error);
            window.location.href = "wallet-conn-error.html";
        }

        // Extracting contract's address and ABI
        try {
            console.log("Attempting simulation...");

            await publicClient.simulateContract({
                address: undefined as never, // TODO: Add deployed contract address
                abi: undefined as never,     // TODO: Add contract ABI
                functionName: "fund",
                account: undefined,           // TODO: Add address obtained from requestAddresses
                value: undefined,             // TODO: Add parsed ETH amount in Wei
            });
        } catch (error: unknown) {
            console.error("Simulation failed:", error);
        }
    } else {
        // Update UI if MetaMask is not detected
        if (connectButton) {
            connectButton.innerHTML = "Please install MetaMask!";
        }
    }
}

// Attach connect function to the button's click event
connectButton?.addEventListener("click", () => {
    void connect();
});

// Logic for handling the funding of our smart contract
async function fund(): Promise<void> {
    if (!ethAmountInput) {
        console.error("ETH amount input was not found.");
        return;
    }

    const ethAmount = ethAmountInput.value; // Grab value from input field
    console.log(`Funding with ${ethAmount}...`);

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
        // Handle the case where MetaMask is not installed
        console.log("Please install MetaMask!");
    }

    // Contract interaction Promise
    await publicClient.simulateContract({
        address: contractAddress,
        abi: coffeeAbi,
    } as never);

    // Fetch the connected accounts
    const accounts = await walletClient.requestAddresses();

    // Use array destructuring to get the first account
    const [connectedAccount] = accounts;

    // Later in the simulateContract call
    await publicClient.simulateContract({
        account: connectedAccount,
        functionName: "fund",
    } as never);

    // Helper function call
    // Get the defined chain object using the walletClient
    const currentChain = await getCurrentChain(walletClient);

    // Later in the simulateContract call
    await publicClient.simulateContract({
        chain: currentChain,
    } as never);

    await publicClient.simulateContract({
        value: parseEther(ethAmount),
    } as never);
}

fundButton?.addEventListener("click", () => {
    void fund();
});

// Helper function for identifying/defining a specific chain
async function getCurrentChain(
    client: ReturnType<typeof createWalletClient>
): Promise<ReturnType<typeof defineChain>> {
    // Get the chain ID from the connected wallet client
    const chainId = await client.getChainId();

    // Define the chain parameters using defineChain
    const currentChain = defineChain({
        id: chainId,
        name: "Local Devnet",
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },
        rpcUrls: {
            // Use the RPC URL of your local node
            default: {
                http: ["http://localhost:8545"],
            },
        },
    });

    return currentChain;
}

async function getBalance(): Promise<void> {
    // Check if a browser Ethereum provider is available
    if (typeof window.ethereum !== "undefined") {
        // Create a Public Client for read-only interactions
        const balanceClient = createPublicClient({
            // Connect Viem to the browser's Ethereum provider
            transport: custom(window.ethereum),
        });

        try {
            // Fetch the balance of the specified address
            const balance = await balanceClient.getBalance({
                address: contractAddress,
            });

            // The balance is returned in Wei as a BigInt
            // Format it into Ether for user-friendly display
            const formattedBalance = formatEther(balance);

            // Log the formatted balance
            console.log(`Contract Balance: ${formattedBalance} ETH`);
        } catch (error: unknown) {
            // Handle potential errors during the asynchronous call
            console.error("Error getting balance:", error);
        }
    } else {
        // Inform the user if MetaMask or another provider isn't installed
        console.log("Please install MetaMask!");
    }
}

// Withdraw function — logic to be added later
withdrawButton?.addEventListener("click", () => {
    void withdraw();
});

async function withdraw(): Promise<void> {
    // TODO: Implement withdrawal logic later
}