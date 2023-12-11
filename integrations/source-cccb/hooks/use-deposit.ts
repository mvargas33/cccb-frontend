import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  usePublicClient,
  useWaitForTransaction,
} from 'wagmi';
import sourceCCCBAbi from '../abi';
import {sourceCCCBSepoliaAddress, sepoliaChainId} from '../constants';
import { useEffect, useMemo } from 'react';
import { createPublicClient, hexToBigInt, http, toHex } from 'viem';
import {
  sepolia,
} from 'viem/chains';

const useDeposit = ({
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
        address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
        abi: sourceCCCBAbi,
        functionName: 'deposit',
        chain: sepolia,
        account: address,
        args: [
          toHex(100)
        ],
        value: hexToBigInt(toHex(tax))
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
    address: sourceCCCBSepoliaAddress,
    abi: sourceCCCBAbi,
    functionName: 'deposit',
    chainId: sepoliaChainId,
    args: [
      toHex(100)
    ],
    value: hexToBigInt(toHex(tax))
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
export default useDeposit;