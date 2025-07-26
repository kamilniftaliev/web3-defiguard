import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import Button from "react-bootstrap/Button";
import { BsFillSendFill } from "react-icons/bs";
import { ImSpinner9 } from "react-icons/im";
import { CgClose } from "react-icons/cg";
import { FaWallet } from "react-icons/fa";

import { getNetworkName, getExplorerLink } from "./utils";

import "./index.css";

function WalletModal({ onClose }) {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [balance, setBalance] = useState("0");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [networkId, setNetworkId] = useState("");

  const isConnected = typeof accounts[0] === "string";

  // Helper function to connect to Web3 provider (MetaMask)
  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setTransactionHash("");

    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);

        const accounts = await web3.eth.requestAccounts();
        setAccounts(accounts);

        // Get network ID
        setNetworkId(await web3.eth.net.getId());

        // Get balance of the account
        if (accounts.length > 0) {
          const ethBalance = await web3.eth.getBalance(accounts[0]);
          setBalance(web3.utils.fromWei(ethBalance, "ether"));
        }

        window.ethereum.on("accountsChanged", (newAccounts) => {
          setAccounts(newAccounts);
          if (newAccounts.length > 0) {
            web3.eth.getBalance(newAccounts[0]).then((bal) => {
              setBalance(web3.utils.fromWei(bal, "ether"));
            });
          } else {
            setBalance("0");
            setWeb3(null);
            setNetworkId("");
          }
          setError("");
          setTransactionHash("");
        });

        window.ethereum.on("chainChanged", () => window.location.reload());
      } else {
        setError(
          "MetaMask is not installed. Please install it to use this wallet."
        );
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError(err.message || "Failed to connect wallet.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Connect wallet on modal open, if not already connected
  useEffect(() => {
    if (!isLoading && !web3) {
      connectWallet();
    }
  }, [web3, connectWallet, isLoading]);

  const sendTransaction = async () => {
    setError("");
    setTransactionHash("");
    if (!web3 || accounts.length === 0) {
      setError("Wallet not connected.");
      return;
    }
    if (
      !web3.utils.isAddress(recipientAddress) ||
      !amount ||
      parseFloat(amount) <= 0
    ) {
      setError("Please enter a valid recipient address and amount.");
      return;
    }

    setIsLoading(true);

    try {
      const valueInWei = web3.utils.toWei(amount, "ether");
      const fromAddress = accounts[0];

      const gasPrice = await web3.eth.getGasPrice();
      const gasLimit = 21000;

      const receipt = await web3.eth.sendTransaction({
        from: fromAddress,
        to: recipientAddress,
        value: valueInWei,
        gas: gasLimit,
        gasPrice: gasPrice,
      });

      setTransactionHash(receipt.transactionHash);
      const newEthBalance = await web3.eth.getBalance(fromAddress);
      setBalance(web3.utils.fromWei(newEthBalance, "ether"));
      setRecipientAddress("");
      setAmount("");
    } catch (err) {
      console.error("Error sending transaction:", err);
      setError(err.message || "Transaction failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const onRecipientAddressChange = useCallback((e) => {
    const address = e.target.value.trim();

    setRecipientAddress(address);
  }, []);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        // Close modal only if clicked outside the wallet container
        if (e.target !== e.currentTarget) return;

        onClose();
      }}
    >
      <div className="wallet-container">
        <button onClick={onClose} className="close-button">
          <CgClose className="close-icon" />
        </button>
        <h3 className="wallet-title">
          {isConnected ? "Your Wallet Info" : "Connect your ETH wallet"}
        </h3>

        {!web3 && !isLoading && (
          <div className="connect-wallet-section">
            <p className="connect-wallet-text">
              Connect your MetaMask wallet to get started.
            </p>
            <button onClick={connectWallet} className="connect-button">
              <FaWallet />
              <span>Connect Wallet</span>
            </button>
          </div>
        )}

        {isLoading && !isConnected && (
          <div className="loading-section">
            <ImSpinner9 className="loading-spinner" />
            <p>Loading wallet data...</p>
          </div>
        )}

        {web3 && isConnected && (
          <div className="wallet-details-section">
            <div>
              <p className="label-text">Connected Account:</p>
              <input disabled value={accounts[0]} />
            </div>
            <div className="d-flex gap-4">
              <div className="flex-grow-1">
                <p className="label-text">Network:</p>
                <input disabled value={getNetworkName(networkId)} />
              </div>
              <div className="flex-grow-1">
                <p className="label-text">Balance:</p>
                <input
                  disabled
                  value={`${parseFloat(balance).toFixed(4)} ETH`}
                />
              </div>
            </div>

            <div className="send-eth-section">
              <h2 className="send-eth-title">Send ETH</h2>
              <div className="input-group">
                <label htmlFor="recipient" className="label-text">
                  Recipient Address:
                </label>
                <input
                  type="text"
                  id="recipient"
                  className="text-input"
                  placeholder="0x..."
                  value={recipientAddress}
                  onChange={onRecipientAddressChange}
                  disabled={isLoading}
                />
              </div>
              <div className="input-group">
                <label htmlFor="amount" className="label-text">
                  Amount (ETH):
                </label>
                <input
                  type="number"
                  id="amount"
                  className="text-input"
                  placeholder="0.0"
                  step="0.0001"
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={sendTransaction}
                className="send-button"
                disabled={
                  isLoading ||
                  !recipientAddress ||
                  !amount ||
                  parseFloat(amount) <= 0
                }
              >
                {isLoading ? (
                  <ImSpinner9 className="loading-spinner-small" />
                ) : (
                  <BsFillSendFill />
                )}
                <span>{isLoading ? "Sending..." : "Send ETH"}</span>
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p className="error-title">Error</p>
            <p className="error-description">{error}</p>
          </div>
        )}

        {transactionHash && (
          <div className="success-message">
            <p className="font-semibold">Transaction Successful!</p>
            <p className="break-words">
              Hash:{" "}
              <a
                href={getExplorerLink(transactionHash, networkId)}
                target="_blank"
                rel="noopener noreferrer"
                className="transaction-link"
              >
                {transactionHash}
              </a>
            </p>
            <p className="transaction-note">
              Click on the hash link above to view the transaction on the
              explorer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function WalletButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} className="wallet-button">
        Wallet
      </Button>

      {isModalOpen && <WalletModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
