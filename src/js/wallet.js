const App = {
    contracts: {},
  
    load: async () => {
        try {
            // Check if user is logged in
            const tokenU = localStorage.getItem("jwtTokenVoter");
            const tokenA = localStorage.getItem("jwtTokenAdmin");
            if (!tokenU & !tokenA) {
                window.location.replace(`http://127.0.0.1:8080/`);  // Redirect to login page
                return;
            }
  
            await App.loadWeb3();
            await App.loadContract();
            await App.loadAccount();
            
        } catch (error) {
            console.error("Error loading app:", error);
        }
    },
  
    loadWeb3: async () => {
        if (window.ethereum) {
            // Modern dapp browsers
            App.web3Provider = window.ethereum;
            window.web3 = new Web3(window.ethereum);
  
            try {
                // Request account access
                await window.ethereum.request({ method: "eth_requestAccounts" });
                console.log("MetaMask connected:", await web3.eth.getAccounts());
            } catch (error) {
                console.error("User denied account access:", error);
            }
        } 
        else if (window.web3) {
            // Legacy dapp browsers
            App.web3Provider = window.web3.currentProvider;
            window.web3 = new Web3(window.web3.currentProvider);
            console.log("Legacy Web3 provider detected.");
        } 
        else {
            console.log("Non-Ethereum browser detected. Consider installing MetaMask!");
        }
    },
  
    loadAccount: async () => {
        const accounts = await web3.eth.getAccounts();
        App.account = accounts[0];
        console.log("Connected Account:", App.account);
        const voterId = localStorage.getItem("voterId");
        const result = await App.voting.getVoterWallet(voterId, { from: App.account });
        console.log(result);
        if(result=== "0x0000000000000000000000000000000000000000" ){
          App.registerVoter();
        }else{
          if(result===App.account){
              window.location.replace(`http://127.0.0.1:8080/index`);
          }
        }
    },
  
    loadContract: async () => {
        try {
            const votingJson = await fetch('/contracts/Voting.json').then(res => res.json());
  
            // Use @truffle/contract
            App.contracts.Voting = TruffleContract(votingJson);
            App.contracts.Voting.setProvider(App.web3Provider);
  
            App.voting = await App.contracts.Voting.deployed();
            console.log("Smart Contract Loaded:", App.voting);
        } catch (error) {
            console.error("Error loading contract:", error);
        }
    },
  
    registerVoter: async () => {
        try {
            const voterId = localStorage.getItem("voterId");  // Assuming voter ID is stored on login
            if (!voterId) {
                console.error("Voter ID not found. User might not be logged in.");
                return;
            }
  
            // Register voter by storing public key & voter ID on blockchain
            await App.voting.registerVoter(voterId, App.account, { from: App.account });
            console.log("Voter registered successfully:", App.account);
        } catch (error) {
            console.error("Error registering voter:", error);
        }
    }
  };
  
  // Run when the page loads
  document.addEventListener("DOMContentLoaded", () => {
    App.load();
  });
  
  export default App;