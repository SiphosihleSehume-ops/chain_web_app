// Playing around with the button
// const button = document.getElementById("btn");

// button.addEventListener("click", () => {
//     window.location.href = "registration.html";
// });

// const backButton = document.getElementById("bck");

// backButton.addEventListener("click", () => {
//     window.history.back();
// })

// Ethereum wallet begins

import { createWalletClient, custom } from "https://esm.sh/viem";

const connectButton = document.getElementById("btn");

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
            connectButton.innerHTML = "Connection Failed";
        }

    } else {
        // Update UI if MetaMusk is not detected
        connectButton.innerHTML = "Please install MetaMusk!";
    }
}

// Attatch connect function top the button's click event 
connectButton.onclick = connect;
