# Smart Web – FundMe dApp

A small web3 demo application that connects to a browser wallet (MetaMask) and lets users **fund** a Solidity smart contract ("Buy Coffee"), check the contract's **balance** and – if they are the contract owner – **withdraw** the funds.

The front end is plain HTML, CSS and JavaScript (no bundler, no build step). Blockchain interaction is done with [Viem](https://viem.sh), loaded straight from a CDN.

---

## Features

- Connect a MetaMask wallet and display the connected account
- Fund the `FundMe` contract with any amount of ETH (minimum **$5 USD** worth, enforced on-chain through a Chainlink ETH/USD price feed)
- Simulate every transaction first, so errors show up *before* the wallet pops up
- Show the contract balance and how much the connected account has funded
- Owner-only withdrawal (anyone else gets a friendly "only the owner" message)
- Live status / error messages on the page instead of only in the console
- Detects when there is no contract on the connected network
- Reloads automatically when the wallet account or network changes
- Registration page (front-end only, see [Notes](#notes)) and a wallet-connection error page

---