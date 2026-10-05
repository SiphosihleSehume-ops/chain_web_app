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

