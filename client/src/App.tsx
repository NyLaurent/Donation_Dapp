import { useState, useEffect } from "react";
import { ethers } from "ethers";
import DonationArtifact from "./artifacts/contracts/Donation.sol/Donation.json";
import WalletConnect from "./components/WalletConnect";
import DonationCreate from "./components/DonationCreate";
import DonationHistory from "./components/DonationHistory";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  const [balance, setBalance] = useState("0");

  // Initialize ethers and contract
  useEffect(() => {
    const init = async () => {
      try {
        // Check if MetaMask is installed
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);

          // Get network
          const network = await provider.getNetwork();
          if (network.chainId.toString() !== "11155111") {
            // Sepolia network ID
            alert("Please connect to Sepolia Testnet");
            setLoading(false);
            return;
          }

          // Set contract address - should be updated after deployment
          const contractAddress = "0xYourDeployedContractAddressHere";
          const donationContract = new ethers.Contract(
            contractAddress,
            DonationArtifact.abi,
            provider
          );
          setContract(donationContract);

          // Listen for account changes
          window.ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
              handleConnect();
            } else {
              setAccount("");
              setSigner(null);
            }
          });
        } else {
          alert("Please install MetaMask to use this dApp");
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
      setLoading(false);
    };

    init();
  }, []);

  // Connect wallet function
  const handleConnect = async () => {
    try {
      setLoading(true);

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      setAccount(account);

      const signer = await provider.getSigner();
      setSigner(signer);

      // Get account balance
      const balance = await provider.getBalance(account);
      setBalance(ethers.formatEther(balance));

      // Load donations
      await loadDonations();

      setLoading(false);
    } catch (error) {
      console.error("Connection error:", error);
      setLoading(false);
    }
  };

  // Load all donations
  const loadDonations = async () => {
    if (contract) {
      try {
        // Get donations count
        const count = await contract.getDonationsCount();
        const donationsArray = [];

        // Get all donations
        for (let i = 0; i < count; i++) {
          const donation = await contract.getDonation(i);
          donationsArray.push({
            donor: donation[0],
            recipient: donation[1],
            amount: ethers.formatEther(donation[2]),
            timestamp: new Date(Number(donation[3]) * 1000).toLocaleString(),
            message: donation[4],
          });
        }

        setDonations(donationsArray.reverse()); // Show newest first
      } catch (error) {
        console.error("Error loading donations:", error);
      }
    }
  };

  // Handle donation submission
  const handleDonate = async (recipientAddress, amount, message) => {
    if (!signer || !contract) return;

    try {
      setLoading(true);

      // Create contract with signer for write operations
      const contractWithSigner = contract.connect(signer);

      // Send donation transaction
      const tx = await contractWithSigner.donate(recipientAddress, message, {
        value: ethers.parseEther(amount),
      });

      // Wait for transaction to be mined
      await tx.wait();

      // Reload donations and update balance
      await loadDonations();
      const newBalance = await provider.getBalance(account);
      setBalance(ethers.formatEther(newBalance));

      setLoading(false);
    } catch (error) {
      console.error("Donation error:", error);
      setLoading(false);
      alert("Error making donation: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-6 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
            <h1 className="text-3xl font-bold">Donation dApp</h1>
          </div>
          <WalletConnect
            account={account}
            balance={balance}
            handleConnect={handleConnect}
          />
        </div>
      </header>

      <main className="container mx-auto my-12 px-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all hover:scale-[1.02]">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Make a Donation
              </h2>
              <DonationCreate
                handleDonate={handleDonate}
                isConnected={!!account}
              />
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all hover:scale-[1.02]">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
                Recent Donations
              </h2>
              <DonationHistory donations={donations} userAddress={account} />
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-gray-300 p-8 mt-12">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            © 2024 Donation dApp - Built with Hardhat, Ethers.js, and React
          </p>
          <p className="text-xs mt-2 text-gray-500">
            A decentralized platform for secure and transparent donations
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
