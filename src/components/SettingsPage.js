import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3'; // Import Web3 library
import WalletVerifierABI from '../WalletVerifierABI.json'; // Import ABI from the root folder

// Generate a unique token identifier
function generateTokenIdentifier(token) {
    // Serialize the token data
    const tokenData = JSON.stringify(token);
  
    // Create a hash of the serialized token data
    const hash = tokenData
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0)
      .toString();
  
    return hash;
}

function SettingsPage() {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState('');
  const [isWalletSigned, setIsWalletSigned] = useState(false);

  useEffect(() => {
    // Check if the wallet is already signed
    const signature = localStorage.getItem('walletSignature');
    const address = localStorage.getItem('walletAddress');
    if (signature && address) {
      setIsWalletSigned(true);
      setWalletAddress(address);
    }
  }, []);

  const handleSignWallet = async () => {
    // Retrieve JWT token from local storage
    const token = localStorage.getItem('jwtToken');

    console.log('Token:', token); // Log the token for troubleshooting
  
    if (!token) {
      // User is not authenticated, redirect to login page
      navigate('/login');
      return;
    }
  
    // Connect to MetaMask and sign the BSC wallet
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const walletAddress = accounts[0];
  
        // Create contract instance using ABI and contract address
        const contractAddress = '0x2caD0a429392b9a8B6d06aC76BeA6Cfd4f103539';
        const walletVerifier = new web3.eth.Contract(WalletVerifierABI, contractAddress);
  
        // Sign the message
        const message = web3.utils.sha3(walletAddress); // Using sha3 as an example
        const signature = await web3.eth.personal.sign(message, walletAddress, '');
  
        console.log('Message:', message);
        console.log('Signature:', signature);
  
        // Verify the signature using the contract's verifySignature function
        const isVerified = await walletVerifier.methods.verifySignature(walletAddress, message, signature).call();
  
        console.log('Signature Verified:', isVerified);
  
        if (isVerified) {
          // Store the wallet address and signature
          localStorage.setItem('walletAddress', walletAddress);
          localStorage.setItem('walletSignature', signature);

          // Generate a unique identifier based on the JWT token
          const token = localStorage.getItem('jwtToken');
          const tokenIdentifier = generateTokenIdentifier(token);

          // Store the wallet address associated with the token identifier
          localStorage.setItem(`walletAddress_${tokenIdentifier}`, walletAddress);
  
          setIsWalletSigned(true);
          setWalletAddress(walletAddress);
  
          console.log('Signed wallet address:', walletAddress);
        } else {
          console.error('Signature verification failed');
        }
      } catch (error) {
        console.error('Error signing wallet:', error);
      }
    } else {
      console.error('MetaMask not available');
    }
  };
  

  const handleLogout = () => {
    // Retrieve JWT token from local storage before removing it
    const token = localStorage.getItem('jwtToken');
    
    // Generate a unique identifier based on the JWT token
    const tokenIdentifier = generateTokenIdentifier(token);
  
    // Clear JWT token and user credentials from local storage
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('registeredUsers'); // Remove this if you're storing user data separately
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletSignature');
  
    // Remove the wallet address associated with the token identifier
    localStorage.removeItem(`walletAddress_${tokenIdentifier}`);
    
    // Redirect to login page
    navigate('/login');
  };
  

  return (
    <div>
      <h2>Settings</h2>
      <button onClick={handleSignWallet} disabled={isWalletSigned}>
        Sign BSC Wallet with MetaMask
      </button>
      {isWalletSigned && (
        <p style={{ color: 'green' }}>Wallet address saving successful: {walletAddress}</p>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default SettingsPage;