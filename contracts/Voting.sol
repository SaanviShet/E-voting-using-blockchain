pragma solidity >=0.4.22 <0.9.0;

contract Voting {
    mapping(bytes32 => address) public voterWallets; // Use bytes32 instead of string

    function registerVoter(string memory aadharId, address walletAddress) public {
        bytes32 aadharHash = keccak256(abi.encodePacked(aadharId)); // Hash the Aadhar ID
        require(voterWallets[aadharHash] == address(0), "Voter already registered");
        
        voterWallets[aadharHash] = walletAddress;
    }

    function getVoterWallet(string memory aadharId) public view returns (address) {
        bytes32 aadharHash = keccak256(abi.encodePacked(aadharId));
        return voterWallets[aadharHash];
    }
}
