const sourceCCCBSepoliaAddress = '0x0C26aa3db119DBbA3D83e86106625A6607135fca';
const sepoliaChainId = 11155111;
const fujiChainId = 43113;
const blockScannerTransactions: Record<number, string> = {
  [11155111]: 'https://sepolia.etherscan.io/tx/',
  [43113]: 'https://testnet.snowtrace.io/tx/',
}

const bnpSepolia = '0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05';


// Fuji
const destinationCCCBFujiAddress = '0xDbF377FBEa3673886b4E05762d56A9FBB819b99e';
const bnpFuji = '0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4';

export {
  sourceCCCBSepoliaAddress,
  sepoliaChainId,
  fujiChainId,
  blockScannerTransactions,
  bnpSepolia,
  destinationCCCBFujiAddress,
  bnpFuji,
}