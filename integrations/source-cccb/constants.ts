const sourceCCCBSepoliaAddress = '0x0C26aa3db119DBbA3D83e86106625A6607135fca';
const sepoliaChainId = 11155111;
const fujiChainId = 43113;
const blockScannerTransactions: Record<number, string> = {
  [11155111]: 'https://sepolia.etherscan.io/tx/',
  [43113]: 'https://testnet.snowtrace.io/tx/',
}

const bnpSepolia = '0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05';

export {
  sourceCCCBSepoliaAddress,
  sepoliaChainId,
  fujiChainId,
  blockScannerTransactions,
  bnpSepolia,
}