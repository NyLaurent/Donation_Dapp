import React, { useState } from "react";
import { ethers } from "ethers";

interface DonationFormProps {
  handleDonate: (recipient: string, amount: string, message: string) => void;
  isConnected: boolean;
}

interface FormErrors {
  recipient?: string;
  amount?: string;
}

const DonationForm = ({ handleDonate, isConnected }: DonationFormProps) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: { [key: string]: any } = {};

    if (!recipient) {
      newErrors.recipient = "Recipient address is required";
    } else if (!ethers.isAddress(recipient)) {
      newErrors.recipient = "Invalid Ethereum address";
    }

    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    if (validateForm()) {
      handleDonate(recipient, amount, message);
      // Clear form
      setRecipient("");
      setAmount("");
      setMessage("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="recipient"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Recipient Address
          </label>
          <div className="relative">
            <input
              type="text"
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                errors.recipient ? "border-red-500" : "border-gray-200"
              } ${!isConnected ? "bg-gray-50" : "bg-white"}`}
              placeholder="0x..."
              disabled={!isConnected}
              aria-label="Recipient Ethereum Address"
              tabIndex={0}
            />
            {errors.recipient && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                {errors.recipient}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Amount (ETH)
          </label>
          <div className="relative">
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                errors.amount ? "border-red-500" : "border-gray-200"
              } ${!isConnected ? "bg-gray-50" : "bg-white"}`}
              placeholder="0.01"
              disabled={!isConnected}
              aria-label="Donation Amount in ETH"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-gray-500 font-medium">ETH</span>
            </div>
            {errors.amount && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                {errors.amount}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Message (optional)
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
              !isConnected ? "bg-gray-50" : "bg-white"
            }`}
            placeholder="Add a personal message..."
            rows={3}
            disabled={!isConnected}
            aria-label="Optional Message for Recipient"
          ></textarea>
        </div>

        <button
          type="submit"
          className={`w-full py-3.5 font-semibold rounded-xl text-white transition-all duration-300 transform hover:-translate-y-0.5 ${
            isConnected
              ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 shadow-lg hover:shadow-xl"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isConnected}
          aria-label="Send Donation"
          tabIndex={isConnected ? 0 : -1}
        >
          <div className="flex items-center justify-center space-x-2">
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            <span>
              {isConnected ? "Send Donation" : "Connect Wallet to Donate"}
            </span>
          </div>
        </button>
      </form>
    </div>
  );
};

export default DonationForm;
