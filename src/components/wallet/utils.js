const ethNetworks = {
  // Ethereum Mainnet and official testnets
  1: "Ethereum Mainnet",
  11155111: "Ethereum Testnet Sepolia",
  17000: "Ethereum Testnet Holesky",
  3: "Ethereum Testnet Ropsten", // Deprecated (PoW)
  4: "Ethereum Testnet Rinkeby", // Deprecated (PoA)
  5: "Ethereum Testnet Görli", // Deprecated (PoA, post-Merge PoS, being phased out)
  42: "Ethereum Testnet Kovan", // Deprecated (PoA)
  0: "Olympic Testnet", // Very old, pre-release PoW testnet, deprecated
  2: "Morden Testnet", // Old, PoW testnet, deprecated

  // Major L2s on Ethereum
  10: "Optimism",
  11155420: "Optimism Sepolia",
  42161: "Arbitrum One",
  421614: "Arbitrum Sepolia",
  8453: "Base",
  84532: "Base Sepolia",
  324: "zkSync Era",
  300: "zkSync Era Testnet",
  59144: "Linea",
  59141: "Linea Sepolia",
  5000: "Mantle",
  5003: "Mantle Sepolia",
  1101: "Polygon zkEVM",
  2442: "Polygon zkEVM Cardona",
  81457: "Blast",
  168587773: "Blast Sepolia",

  // Other significant EVM-compatible chains (often interact with Ethereum ecosystem)
  56: "BNB Smart Chain Mainnet",
  97: "BNB Smart Chain Testnet",
  137: "Polygon Mainnet",
  80001: "Polygon Mumbai", // Deprecated (replaced by Amoy)
  80002: "Polygon Amoy", // New Polygon testnet
  43114: "Avalanche C-Chain",
  43113: "Avalanche Fuji Testnet",
  250: "Fantom Opera",
  4002: "Fantom Testnet",
  100: "Gnosis Chain", // Formerly xDai Chain
  10200: "Gnosis Chiado Testnet",
  1284: "Moonbeam",
  1285: "Moonriver",
  1287: "Moonbase Alpha",
  25: "Cronos Mainnet Beta",
  338: "Cronos Testnet",
  7000: "Zetachain",
  7001: "Zetachain Testnet",
  1135: "Lisk",
  4202: "Lisk Sepolia Testnet",
  369: "Pulsechain",

  // Ethereum Classic networks (forked from Ethereum, distinct chain IDs)
  61: "Ethereum Classic Mainnet",
  62: "Morden Classic Testnet", // Deprecated ETC testnet
  63: "Mordor Classic Testnet",
  6: "Kotti Classic Testnet",

  // Less common or highly specific EVM chains / testnets
  69: "Optimism Kovan", // Optimism's testnet on Kovan, also deprecated
  77: "Sokol Testnet", // POA Network testnet
  99: "POA Core", // POA Network mainnet
  1337: "Geth Development Network", // Local private network
  401697: "Tobalaba", // Energy Web Foundation testnet
  88888: "Chiliz Mainnet",
  88882: "Chiliz Testnet",
  747: "Flow EVM Mainnet",
  545: "Flow EVM Testnet",
  2020: "Ronin Mainnet",
  2021: "Ronin Saigon Testnet",
  204: "opBNB Mainnet",
  5611: "opBNB Testnet",
};

export function getNetworkName(networkId) {
  return ethNetworks[networkId] || `Unknown Network (${networkId})`;
}

const EXPLORER_URLS = {
  // Ethereum Mainnet and official testnets
  1: "https://etherscan.io", // Ethereum Mainnet
  11155111: "https://sepolia.etherscan.io", // Sepolia Testnet
  17000: "https://holesky.etherscan.io", // Holesky Testnet
  3: "https://ropsten.etherscan.io", // Ropsten Testnet (Deprecated)
  4: "https://rinkeby.etherscan.io", // Rinkeby Testnet (Deprecated)
  5: "https://goerli.etherscan.io", // Görli Testnet (Deprecated)
  42: "https://kovan.etherscan.io", // Kovan Testnet (Deprecated)

  // Major L2s on Ethereum (often have their own *scan.com explorers)
  10: "https://optimistic.etherscan.io", // Optimism Mainnet (often optimisms.etherscan.io too)
  11155420: "https://sepolia-optimism.etherscan.io", // Optimism Sepolia
  42161: "https://arbiscan.io", // Arbitrum One
  421614: "https://sepolia.arbiscan.io", // Arbitrum Sepolia
  8453: "https://basescan.org", // Base Mainnet
  84532: "https://sepolia.basescan.org", // Base Sepolia
  324: "https://explorer.zksync.io", // zkSync Era Mainnet (Note: different structure)
  300: "https://sepolia.explorer.zksync.io", // zkSync Era Sepolia Testnet
  59144: "https://lineascan.build", // Linea Mainnet
  59141: "https://sepolia.lineascan.build", // Linea Sepolia

  // Other significant EVM-compatible chains
  56: "https://bscscan.com", // BNB Smart Chain Mainnet
  97: "https://testnet.bscscan.com", // BNB Smart Chain Testnet
  137: "https://polygonscan.com", // Polygon Mainnet
  80001: "https://mumbai.polygonscan.com", // Polygon Mumbai (Deprecated)
  80002: "https://amoy.polygonscan.com", // Polygon Amoy (New Polygon testnet)
  43114: "https://snowtrace.io", // Avalanche C-Chain
  43113: "https://testnet.snowtrace.io", // Avalanche Fuji Testnet
  250: "https://ftmscan.com", // Fantom Opera
  4002: "https://testnet.ftmscan.com", // Fantom Testnet
  100: "https://gnosisscan.io", // Gnosis Chain
};

/**
 * Generates an explorer link for a given transaction hash and chain ID.
 * @param {string} transactionHash The transaction hash.
 * @param {number} chainId The chain ID of the network.
 * @returns {string|null} The explorer URL or null if the chain ID is not supported.
 */
export function getExplorerLink(transactionHash, chainId) {
  const baseUrl = EXPLORER_URLS[chainId];

  if (!baseUrl) {
    console.warn(`No explorer URL found for chain ID: ${chainId}`);
    return null;
  }

  // Most explorers follow a similar pattern: /tx/ or /transaction/
  // However, some like zkSync Era are different. Handle exceptions.
  if (chainId === 324 || chainId === 300) {
    // zkSync Era Mainnet and Testnet
    return `${baseUrl}/tx/${transactionHash}`; // zkSync uses /tx/
  }

  // Default for Etherscan-like explorers
  return `${baseUrl}/tx/${transactionHash}`;
}
