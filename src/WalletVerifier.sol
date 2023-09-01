// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WalletVerifier {
    mapping(address => bytes32) public userSignatures;

    function signMessage(bytes32 message) public {
        userSignatures[msg.sender] = message;
    }

    function verifySignature(address userAddress, bytes32 message, bytes memory signature)
        public
        pure
        returns (bool)
    {
        bytes32 prefixedMessage = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", message));
        address recoveredAddress = recoverSigner(prefixedMessage, signature);
        return recoveredAddress == userAddress;
    }

    function recoverSigner(bytes32 message, bytes memory signature)
        internal
        pure
        returns (address)
    {
        bytes32 r;
        bytes32 s;
        uint8 v;

        if (signature.length != 65) {
            return address(0);
        }

        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        if (v < 27) {
            v += 27;
        }

        if (v != 27 && v != 28) {
            return address(0);
        }

        return ecrecover(message, v, r, s);
    }
}
