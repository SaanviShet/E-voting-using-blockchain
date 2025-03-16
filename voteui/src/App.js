// voteui/src/App.js
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import Voting from './contracts/Voting.json';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState(["Saanvi", "Payal", "Sakshi"]);
  const [votes, setVotes] = useState({});

  useEffect(() => {
    const init = async () => {
      const web3Instance = new Web3(Web3.givenProvider || "http://localhost:7545");
      const accounts = await web3Instance.eth.getAccounts();
      console.log(accounts);

     
      const networkId = await web3Instance.eth.net.getId();
      const deployedNetwork = Voting.networks[networkId];
      const instance = new web3Instance.eth.Contract(
        Voting.abi,
        deployedNetwork && deployedNetwork.address,
      );

      setWeb3(web3Instance);
      setAccounts(accounts);
      setContract(instance);

      // Load initial votes
      const votesObj = {};
      for (let candidate of candidates) {
        const count = await instance.methods.totalVotesFor(candidate).call();
        votesObj[candidate] = count;
      }
      setVotes(votesObj);
    };
    init();
  }, []);

  const vote = async (candidate) => {
    await contract.methods.voteForCandidate(candidate).send({ from: accounts[0] });
    const count = await contract.methods.totalVotesFor(candidate).call();
    setVotes({ ...votes, [candidate]: count });
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Voting DApp</h1>
      {candidates.map((candidate) => (
        <div key={candidate}>
          <h3>{candidate}: {votes[candidate] || 0} votes</h3>
          <button onClick={() => vote(candidate)}>Vote for {candidate}</button>
        </div>
      ))}
    </div>
  );
}

export default App;
