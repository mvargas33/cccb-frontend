const sepoliaChainId = 11155111;
const fujiChainId = 43113;
const blockScannerTransactions: Record<number, string> = {
  [11155111]: 'https://sepolia.etherscan.io/tx/',
  [43113]: 'https://testnet.snowtrace.io/tx/',
}

// Contracts
const sourceCCCBSepoliaAddress = '0x953c24C9ca7ce31Aee0B4BE2172f6ad810bAfd6B';
const destinationCCCBFujiAddress = '0x74f8D74e72749C56513698255565173849eD524E';
// BnP
const bnpFuji = '0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4';
const bnpSepolia = '0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05';

export {
  sourceCCCBSepoliaAddress,
  sepoliaChainId,
  fujiChainId,
  blockScannerTransactions,
  bnpSepolia,
  destinationCCCBFujiAddress,
  bnpFuji,
}