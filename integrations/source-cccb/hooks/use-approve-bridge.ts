import {
  erc20ABI,
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  usePublicClient,
  useWaitForTransaction,
} from 'wagmi';
import sourceCCCBAbi from '../abi';
import {sourceCCCBSepoliaAddress, sepoliaChainId, bnpSepolia} from '../constants';
import { useEffect, useMemo } from 'react';
import { createPublicClient, hexToBigInt, http, toHex } from 'viem';
import {
  sepolia,
} from 'viem/chains';

const useApproveBridge = ({
  tax,
}: { tax: number }) => {
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http()
  })

  useEffect(() => {
    const r = async () => {
      const { result } = await publicClient.simulateContract({
        address: bnpSepolia, // BnP Sepolia
        abi: erc20ABI,
        functionName: 'approve',
        chain: sepolia,
        account: address,
        args: [
          sourceCCCBSepoliaAddress,
          hexToBigInt(toHex(1000))
        ],
      })
      r();
      console.log(result, 'result')
    }
  }, [address, publicClient, tax])


  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: bnpSepolia,
    abi: erc20ABI,
    functionName: 'approve',
    chainId: sepoliaChainId,
    args: [
      sourceCCCBSepoliaAddress,
          hexToBigInt(toHex(1000))
    ],
  });

  const {
    data,
    write,
    error,
    isError,
  } = useContractWrite(config);
  const {
    isLoading, isSuccess,
  } = useWaitForTransaction({ hash: data?.hash });

  const errors: (string | unknown)[] = useMemo(() => {
    let allErrors: (string | unknown)[] = [];
    if (prepareError) {
      allErrors = [...allErrors, prepareError.message];
    }
    if (error) {
      allErrors = [...allErrors, error.message];
    }
    return allErrors;
  }, [prepareError, error]);

  return {
    sendTransaction: write ?? (() => { }),
    data: data ?? undefined,
    isLoading,
    isSuccess,
    prepareError: prepareError?.message ?? null,
    isPrepareError,
    error: error?.message ?? null,
    isError,
    errors,
    isSomeError: isPrepareError || isError,
  };
}
export default useApproveBridge;