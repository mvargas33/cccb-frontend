import { UseContractReadConfig, useContractRead } from "wagmi";
import { destinationCCCBFujiAddress, fujiChainId } from "../../source-cccb/constants";
import destinationCCCBAbi from '../abi';
import { useCallback, useMemo } from "react";
import { hexToNumber } from "viem";

interface Round {
  roundId: number;
  balances: number[];
  participants: string[];
}

interface UseGetContractStateResponse {
  contractState: string;
  tokenAddress: string;
  destinationChainSelector: number;
  destinationContract: string;
  currentRoundId: number;
  currentTokenAmount: number;
  currentRound: Round;
  tokenBalance: number;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const useGetContractState = (): UseGetContractStateResponse => {
  const commonParams: UseContractReadConfig = {
    address: destinationCCCBFujiAddress,
    chainId: fujiChainId,
    watch: false,
    enabled: false,
    cacheTime: 0,
    staleTime: 0,
  }

  const {
    data: contractStateRaw,
    isLoading: contractStateLoading,
    refetch: contractStateRefetch,
  } = useContractRead({
    ...commonParams,
    abi: destinationCCCBAbi,
    functionName: 'getContractState',
  });

  const {
    data: tokenAddressRaw,
    isLoading: tokenAddressLoading,
    refetch: tokenAddressRefetch,
  } = useContractRead({
    ...commonParams,
    abi: destinationCCCBAbi,
    functionName: 'getTokenAddress',
  });

  const {
    data: destinationChainSelectorRaw,
    isLoading: destinationChainSelectorLoading,
    refetch: destinationChainSelectorRefetch,
  } = useContractRead({
    ...commonParams,
    abi: destinationCCCBAbi,
    functionName: 'getDestinationChainSelector',
  });

  const {
    data: destinationContractRaw,
    isLoading: destinationContractLoading,
    refetch: destinationContractRefetch,
  } = useContractRead({
    ...commonParams,
    abi: destinationCCCBAbi,
    functionName: 'getDestinationContract',
  });

  const {
    data: currentRoundIdRaw,
    isLoading: currentRoundIdLoading,
    refetch: currentRoundIdRefetch,
  } = useContractRead({
    ...commonParams,
    abi: destinationCCCBAbi,
    functionName: 'getCurrentRoundId',
  });

  const {
    data: currentTokenAmountRaw,
    isLoading: currentTokenAmountLoading,
    refetch: currentTokenAmountRefetch,
  } = useContractRead({
    ...commonParams,
    abi: destinationCCCBAbi,
    functionName: 'getCurrentTokenAmount',
  });

  const {
    data: currentRoundRaw,
    isLoading: currentRoundLoading,
    refetch: currentRoundRefetch,
  } = useContractRead({
    ...commonParams,
    abi: destinationCCCBAbi,
    functionName: 'getRound',
    args: [
      currentRoundIdRaw ?? 0
    ]
  });

  const {
    data: tokenBalanceRaw,
    isLoading: tokenBalanceLoading,
    refetch: tokenBalanceRefetch,
  } = useContractRead({
    ...commonParams,
    abi: destinationCCCBAbi,
    functionName: 'getContractTokenBalance',
  });

  const tokenBalance = useMemo(() => {
    if (!tokenBalanceLoading && tokenBalanceRaw) {
      return hexToNumber(tokenBalanceRaw as `0x{string}`);
    }
    return 0;
  }, [tokenBalanceRaw, tokenBalanceLoading])

  const currentRound = useMemo(() => {
    if (!currentRoundLoading && currentRoundRaw) {
      const round = currentRoundRaw as any;
      return {
        roundId: hexToNumber(round.roundId as `0x{string}`),
        balances: round.balances.map((balance: any) => hexToNumber(balance as `0x{string}`)),
        participants: round.participants,
      }
    }
    return {
      roundId: 0,
      balances: [],
      participants: []
    };
  }, [currentRoundRaw, currentRoundLoading])

  const currentTokenAmount = useMemo(() => {
    if (!currentTokenAmountLoading && currentTokenAmountRaw) {
      return hexToNumber(currentTokenAmountRaw as `0x{string}`);
    }
    return 0;
  }, [currentTokenAmountRaw, currentTokenAmountLoading])

  const currentRoundId = useMemo(() => {
    if (!currentRoundIdLoading && currentRoundIdRaw) {
      return hexToNumber(currentRoundIdRaw as `0x{string}`);
    }
    return 0;
  }, [currentRoundIdRaw, currentRoundIdLoading])

  const destinationContract = useMemo(() => {
    if (!destinationContractLoading) {
      return destinationContractRaw as string;
    }
    return '';
  }, [destinationContractRaw, destinationContractLoading])

  const destinationChainSelector = useMemo(() => {
    if (!destinationChainSelectorLoading && destinationChainSelectorRaw) {
      return hexToNumber(destinationChainSelectorRaw as `0x{string}`)
    }
    return 0;
  }, [destinationChainSelectorRaw, destinationChainSelectorLoading])

  const tokenAddress = useMemo(() => {
    if (!tokenAddressLoading) {
      return tokenAddressRaw as string;
    }
    return '';
  }, [tokenAddressRaw, tokenAddressLoading])

  const contractState = useMemo(() => {
    if (contractStateLoading) {
      return '';
    }
    if (contractStateRaw === 0) {
      return 'OPEN'
    } else if (contractStateRaw === 1) {
      return 'BLOCKED'
    }
    return '';
  }, [contractStateRaw, contractStateLoading]);

  const isLoading = useMemo(() => {
    return contractStateLoading
    || tokenAddressLoading
      || destinationChainSelectorLoading
      || destinationContractLoading
      || currentRoundIdLoading
      || currentTokenAmountLoading
      || currentRoundLoading
      || tokenBalanceLoading
  }, [contractStateLoading, currentRoundIdLoading, currentRoundLoading, currentTokenAmountLoading, destinationChainSelectorLoading, destinationContractLoading, tokenAddressLoading, tokenBalanceLoading]);

  const refetch = useCallback(async () => {
    const r = async () => {
      const promises = [
        contractStateRefetch(),
        tokenAddressRefetch(),
        destinationChainSelectorRefetch(),
        destinationContractRefetch(),
        currentRoundIdRefetch(),
        currentTokenAmountRefetch(),
        currentRoundRefetch(),
        tokenBalanceRefetch(),
      ]
      await Promise.all(promises);
    };
    await r();
  },[contractStateRefetch, currentRoundIdRefetch, currentRoundRefetch, currentTokenAmountRefetch, destinationChainSelectorRefetch, destinationContractRefetch, tokenAddressRefetch, tokenBalanceRefetch])

  return {
    contractState,
    tokenAddress,
    destinationChainSelector,
    destinationContract,
    currentRoundId,
    currentTokenAmount,
    currentRound,
    tokenBalance,
    isLoading,
    refetch,
  }
} 

export default useGetContractState;