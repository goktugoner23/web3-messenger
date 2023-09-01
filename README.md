# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

A messaging app using Web3. Using local storage for now to store userdata as jwt tokens. Will add backend code later.

In the app's settings page the user would verify the wallet and the app will store the wallet address along with the jwt token of the user.

You can see the smart contract for verifying the wallet and the ABI, I uploaded them to the project root. Also uploded the smart contract to Remix IDE and tested it, so it works fine.

For now the app works on the BSC Testnet, so you will see a prompt in your Metamask plugin to add it to your network list if it's not there.

In the settings page of the app, when you log out, the app deletes the jwt token and the wallet address associated, so when you register again you have to sign the contract again. Please have some Test-BNB in your wallet. You can add testnet BNB to your wallet by going to the BSC faucet: https://testnet.bnbchain.org/faucet-smart

Only did the authentication process(local) and verifying the wallet mechanic, will work on this more later.
