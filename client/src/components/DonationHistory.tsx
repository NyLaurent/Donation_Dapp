interface Donation {
  donor: string;
  recipient: string;
  amount: string;
  message: string;
  timestamp: string;
}

interface DonationListProps {
  donations: Donation[];
  userAddress: string;
}

const DonationList = ({ donations, userAddress }: DonationListProps) => {
  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Check if the address is the current user
  const isUserAddress = (address: string) => {
    return userAddress && address.toLowerCase() === userAddress.toLowerCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 overflow-hidden">
      {donations.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            ></path>
          </svg>
          <p className="text-lg font-medium">No donations yet</p>
          <p className="text-sm mt-2">Be the first to make a donation!</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {donations.map((donation, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${isUserAddress(donation.donor) ? "bg-indigo-500" : "bg-gray-400"}`}
                  ></div>
                  <div>
                    <span className="text-xs text-gray-500">From</span>
                    <span
                      className={`ml-2 text-sm font-medium ${
                        isUserAddress(donation.donor)
                          ? "text-indigo-600"
                          : "text-gray-900"
                      }`}
                    >
                      {isUserAddress(donation.donor)
                        ? "You"
                        : formatAddress(donation.donor)}
                    </span>
                  </div>
                </div>
                <div className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {parseFloat(donation.amount).toFixed(4)} ETH
                </div>
              </div>

              <div className="flex items-center mb-3">
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${isUserAddress(donation.recipient) ? "bg-pink-500" : "bg-gray-400"}`}
                ></div>
                <div>
                  <span className="text-xs text-gray-500">To</span>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      isUserAddress(donation.recipient)
                        ? "text-pink-600"
                        : "text-gray-900"
                    }`}
                  >
                    {isUserAddress(donation.recipient)
                      ? "You"
                      : formatAddress(donation.recipient)}
                  </span>
                </div>
              </div>

              {donation.message && (
                <div className="mt-3 text-sm text-gray-600 p-3 bg-white rounded-lg border border-gray-100">
                  <svg
                    className="w-4 h-4 text-gray-400 float-left mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    ></path>
                  </svg>
                  {donation.message}
                </div>
              )}

              <div className="mt-3 text-xs text-gray-400 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                {donation.timestamp}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationList;
