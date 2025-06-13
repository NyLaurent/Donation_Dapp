interface ConnectWalletProps {
  account: string;
  balance: string;
  handleConnect: () => void;
}

const ConnectWallet = ({
  account,
  balance,
  handleConnect,
}: ConnectWalletProps) => {
  // Format account address for display (0x1234...5678)
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <div className="flex items-center space-x-4">
      {account ? (
        <div className="flex items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/20 hover:bg-opacity-20 transition-all duration-300">
          <div className="mr-3">
            <div className="text-sm font-medium text-white">
              {formatAddress(account)}
            </div>
            <div className="text-xs text-gray-200">
              {Number.parseFloat(balance).toFixed(4)} ETH
            </div>
          </div>
          <div className="flex items-center">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="ml-2 text-xs text-green-400">Connected</span>
          </div>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium py-2.5 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
          aria-label="Connect Wallet"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            ></path>
          </svg>
          <span>Connect Wallet</span>
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
