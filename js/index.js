// Playing around with the button
const button = document.getElementById("btn");
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById("ethAmount");
// const balanceButton = document.getElementById("balanceButton");

button.addEventListener("click", () => {
    window.location.href = "registration.html";
});

// const backButton = document.getElementById("bck");

// backButton.addEventListener("click", () => {
//     window.history.back();
// })

// Ethereum wallet begins

import { createWalletClient, custom } from "https://esm.sh/viem";

const connectButton = document.getElementById("btn2");

// Variable to hold the wallet client instance
let walletClient;

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
​
        // Now we can proceed with transaction logic...
​
    } else {
        // Handle the case where MetaMask (or other provider) is not installed
        console.log("Please install MetaMask!");
        // Consider disabling the button or updating its text here
        // e.g., fundButton.innerHTML = "Please Install MetaMask";
    }
}

fundButton.onclick = fund;
// balanceButton.onclick = getBalance; // Will add later