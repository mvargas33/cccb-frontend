import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  usePublicClient,
  useWaitForTransaction,
} from 'wagmi';
import destinationCCCBAbi from '../abi';
import { useMemo } from 'react';
import { destinationCCCBFujiAddress, fujiChainId } from '../../source-cccb/constants';

const useDistributeFunds = () => {
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: destinationCCCBFujiAddress,
    abi: destinationCCCBAbi,
    functionName: 'distributeFunds',
    chainId: fujiChainId,
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
export default useDistributeFunds;