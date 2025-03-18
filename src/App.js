// voteui/src/App.js
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import Voting from './contracts/Voting.json';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [candidates] = useState(["Saanvi", "Payal", "Sakshi"]);
  const [votes, setVotes] = useState({});
  const [error, setError] = useState(null);


  useEffect(() => {
    const init = async () => {     
      try {
        await connectWallet();
        
      } catch (err) {
        setError(err.message);
      }
    };
    init();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3Instance.eth.getAccounts();
      setWeb3(web3Instance);
      setAccounts(accounts);
      await loadContract(web3Instance);
    } else {
      throw new Error('Please install MetaMask!');
    }
  };

  const loadContract = async (web3Instance) => {
    const networkId = await web3Instance.eth.net.getId();
    const deployedNetwork = Voting.networks[networkId];

    console.log("Deployed Network ID: ", networkId);
    console.log("Deployed Network Data: ", deployedNetwork);
    if (!deployedNetwork) {
      throw new Error('Smart contract not deployed on the detected network');
    }

    console.log("Deployed address:", deployedNetwork.address);
    const instance = new web3Instance.eth.Contract(Voting.abi, deployedNetwork.address);
    setContract(instance);

    const votesObj = {};
    for (let candidate of candidates) {
      const count = await instance.methods.totalVotesFor(candidate).call();
      votesObj[candidate] = count;
    }
    setVotes(votesObj);
  };

  const vote = async (candidate) => {
    try {
      if (!contract) {
        setError('Smart contract is not loaded!');
        return;
      }
      await contract.methods.voteForCandidate(candidate).send({ from: accounts[0] });
      const count = await contract.methods.totalVotesFor(candidate).call();
      setVotes({ ...votes, [candidate]: count });
    } catch (err) {
      setError('Transaction Failed: ' + err.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Voting DApp</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {
      !accounts.length ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <>
            <p>Connected as: {accounts[0]}</p>
            {candidates.map((candidate) => (
              <div key={candidate}>
                <h3>{candidate}: {votes[candidate] || 0} votes</h3>
                <button onClick={() => vote(candidate)}>Vote for {candidate}</button>
              </div>
            ))}
          </>
        )
      }

    </div>
  );
}

export default App;
