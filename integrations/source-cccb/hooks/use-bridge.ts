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
import { createPublicClient, http } from 'viem';
import {
  sepolia,
} from 'viem/chains';

const useBridge = () => {
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
        functionName: 'bridge',
        chain: sepolia,
        account: address,
      })
      r();
      console.log(result, 'result')
    }
  }, [address, publicClient])


  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: sourceCCCBSepoliaAddress,
    abi: sourceCCCBAbi,
    functionName: 'bridge',
    chainId: sepoliaChainId,
    args: [],
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
export default useBridge;