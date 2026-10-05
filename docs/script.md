# Web3 Frontend Interaction with Viem and MetaMask

## 1. Overview

This JavaScript file provides the frontend logic for interacting with an Ethereum smart contract through **MetaMask** and **Viem**.

The script is responsible for:

- Connecting the user's browser wallet through MetaMask.
- Creating Viem wallet and public clients.
- Detecting the connected Ethereum network.
- Sending ETH to a smart contract through a `fund()` function.
- Simulating smart-contract transactions before execution.
- Reading the ETH balance of the deployed smart contract.
- Converting ETH values from human-readable Ether into Wei.
- Redirecting users to different pages based on wallet connection or button interactions.

The application uses:

- **MetaMask** as the browser wallet.
- **Viem** as the Ethereum interaction library.
- **JavaScript** for frontend logic.
- **A local Ethereum development network**, such as Anvil, running on `localhost:8545`.
- A deployed smart contract whose address and ABI are imported from `constants-js.js`.

---

# 2. Dependencies

The script imports the following functionality from Viem:

```javascript
import {
    createWalletClient,
    custom,
    createPublicClient,
    defineChain,
    parseEther
} from "https://esm.sh/viem";
```

It also imports the smart-contract configuration:

```javascript
import {
    contractAddress,
    coffeeAbi
} from "./constants-js.js";
```

### Viem functions used

| Function | Purpose |
|---|---|
| `createWalletClient()` | Creates a client capable of interacting with a user's wallet |
| `createPublicClient()` | Creates a client for reading blockchain data and simulating transactions |
| `custom()` | Allows Viem to communicate with the browser wallet provider |
| `defineChain()` | Defines the blockchain network being used |
| `parseEther()` | Converts an ETH amount into Wei |

---

# 3. HTML Elements

The script retrieves several elements from the HTML document:

```javascript
const button = document.getElementById("btn");
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById("ethAmount");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
const connectButton = document.getElementById("btn2");
```

These elements are used to trigger different pieces of functionality.

| Element | Purpose |
|---|---|
| `btn` | Redirects the user to the registration page |
| `btn2` | Connects MetaMask |
| `fundButton` | Starts the funding process |
| `balanceButton` | Retrieves the contract's ETH balance |
| `withdrawButton` | Intended to trigger withdrawal functionality |
| `ethAmount` | Input field containing the amount of ETH to send |

---

# 4. Client Variables

Two global variables are declared:

```javascript
let publicClient;
let walletClient;
```

### Wallet Client

The `walletClient` is responsible for interacting with the user's wallet.

It is created using:

```javascript
walletClient = createWalletClient({
    transport: custom(window.ethereum),
});
```

The `custom(window.ethereum)` transport allows Viem to communicate with MetaMask through the browser's Ethereum provider.

### Public Client

The `publicClient` is intended to be used for blockchain reads and transaction simulations.

It should eventually be initialized with:

```javascript
createPublicClient(...)
```

before functions such as `simulateContract()` are called.

---

# 5. Navigation

The first button redirects the user to the registration page:

```javascript
button.addEventListener("click", () => {
    window.location.href = "registration.html";
});
```

When the button with ID `btn` is clicked, the browser navigates to:

```text
registration.html
```

---

# 6. Connecting MetaMask

The `connect()` function handles wallet connection.

```javascript
async function connect() {
    if (typeof(window.ethereum) !== "undefined") {
        console.log("MetaMask is installed!");

        try {
            walletClient = createWalletClient({
                transport: custom(window.ethereum),
            });

            await walletClient.requestAddresses();

            connectButton.innerHTML = "Connected!";
        } catch (error) {
            console.error("Failed to connect: ", error);
            window.location.href = "wallet-conn-error.html";
        }
    } else {
        connectButton.innerHTML = "Please install MetaMask!";
    }
}
```

## 6.1 Detecting MetaMask

The following condition checks whether a browser Ethereum provider exists:

```javascript
typeof window.ethereum !== "undefined"
```

If `window.ethereum` exists, the browser has an Ethereum-compatible wallet provider available.

Typically, this is supplied by MetaMask.

---

## 6.2 Creating the Wallet Client

Viem connects to MetaMask using:

```javascript
walletClient = createWalletClient({
    transport: custom(window.ethereum),
});
```

The `custom()` transport tells Viem to use the provider supplied by the browser.

---

## 6.3 Requesting Wallet Access

The following line requests access to the user's wallet addresses:

```javascript
await walletClient.requestAddresses();
```

MetaMask may display a permission window asking the user to connect their wallet.

If the connection succeeds, the button text is changed:

```javascript
connectButton.innerHTML = "Connected!";
```

---

## 6.4 Handling Connection Errors

If the connection fails:

```javascript
catch (error) {
    console.error("Failed to connect: ", error);
    window.location.href = "wallet-conn-error.html";
}
```

The error is printed to the browser console and the user is redirected to the wallet connection error page.

---

# 7. Connecting the Button to the Connect Function

The connection function is attached to the button using:

```javascript
connectButton.onclick = connect;
```

Therefore, clicking the button with ID `btn2` executes:

```text
connect()
```

---

