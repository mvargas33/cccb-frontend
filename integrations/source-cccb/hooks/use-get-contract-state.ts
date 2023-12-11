import { hexToNumber } from 'viem';
import { useCallback, useMemo } from 'react';
import {
  UseContractReadConfig,
  erc20ABI,
  useContractRead,
} from 'wagmi';
import sourceCCCBAbi from '../abi';
import {sourceCCCBSepoliaAddress, sepoliaChainId} from '../constants';

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
  depositTax: number;
  protocolReward: number;
  callerReward: number;
  tokenBalance: number;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

const useGetContractState = (): UseGetContractStateResponse => {
  const commonParams: UseContractReadConfig = {
    address: sourceCCCBSepoliaAddress,
    chainId: sepoliaChainId,
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
    abi: sourceCCCBAbi,
    functionName: 'getContractState',
  });

  const {
    data: tokenAddressRaw,
    isLoading: tokenAddressLoading,
    refetch: tokenAddressRefetch,
  } = useContractRead({
    ...commonParams,
    abi: sourceCCCBAbi,
    functionName: 'getTokenAddress',
  });

  const {
    data: destinationChainSelectorRaw,
    isLoading: destinationChainSelectorLoading,
    refetch: destinationChainSelectorRefetch,
  } = useContractRead({
    ...commonParams,
    abi: sourceCCCBAbi,
    functionName: 'getDestinationChainSelector',
  });

  const {
    data: destinationContractRaw,
    isLoading: destinationContractLoading,
    refetch: destinationContractRefetch,
  } = useContractRead({
    ...commonParams,
    abi: sourceCCCBAbi,
    functionName: 'getDestinationContract',
  });

  const {
    data: currentRoundIdRaw,
    isLoading: currentRoundIdLoading,
    refetch: currentRoundIdRefetch,
  } = useContractRead({
    ...commonParams,
    abi: sourceCCCBAbi,
    functionName: 'getCurrentRoundId',
  });

  const {
    data: currentTokenAmountRaw,
    isLoading: currentTokenAmountLoading,
    refetch: currentTokenAmountRefetch,
  } = useContractRead({
    ...commonParams,
    abi: sourceCCCBAbi,
    functionName: 'getCurrentTokenAmount',
  });

  const {
    data: currentRoundRaw,
    isLoading: currentRoundLoading,
    refetch: currentRoundRefetch,
  } = useContractRead({
    ...commonParams,
    abi: sourceCCCBAbi,
    functionName: 'getCurrentRound',
  });

  const {
    data: depositTaxRaw,
    isLoading: depositTaxLoading,
    refetch: depositTaxRefetch,
  } = useContractRead({
    ...commonParams,
    abi: sourceCCCBAbi,
    functionName: 'getDepositTax',
  });

  const {
    data: estimatedRewardsRaw,
    isLoading: estimatedRewardsLoading,
    refetch: estimatedRewardsRefetch,
  } = useContractRead({
    ...commonParams,
    abi: sourceCCCBAbi,
    functionName: 'getEstimatedRewards',
  });

  const {
    data: tokenBalanceRaw,
    isLoading: tokenBalanceLoading,
    refetch: tokenBalanceRefetch,
  } = useContractRead({
    ...commonParams,
    abi: sourceCCCBAbi,
    functionName: 'getContractTokenBalance',
  });

  const tokenBalance = useMemo(() => {
    if (!tokenBalanceLoading && tokenBalanceRaw) {
      return hexToNumber(tokenBalanceRaw as `0x{string}`);
    }
    return 0;
  }, [tokenBalanceRaw, tokenBalanceLoading])

  const estimatedRewards = useMemo(() => {
    if (!estimatedRewardsLoading && estimatedRewardsRaw) {
      const r = estimatedRewardsRaw as `0x{string}`[];
      return {
        protocolReward: hexToNumber(r[0]),
        callerReward: hexToNumber(r[1]),
      }
    }
    return {
      protocolReward: 0,
      callerReward: 0,
    }
  }, [estimatedRewardsRaw, estimatedRewardsLoading])

  const depositTax = useMemo(() => {
    if (!depositTaxLoading && depositTaxRaw) {
      return hexToNumber(depositTaxRaw as `0x{string}`);
    }
    return 0;
  }, [depositTaxRaw, depositTaxLoading])

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
  }, [contractStateRaw, contractStateLoading])

  const isLoading = useMemo(() => {
    return contractStateLoading
      || tokenAddressLoading
      || destinationChainSelectorLoading
      || destinationContractLoading
      || currentRoundIdLoading
      || currentTokenAmountLoading
      || currentRoundLoading
      || depositTaxLoading
      || estimatedRewardsLoading
      || tokenBalanceLoading
  }, [contractStateLoading, currentRoundIdLoading, currentRoundLoading, currentTokenAmountLoading, depositTaxLoading, destinationChainSelectorLoading, destinationContractLoading, estimatedRewardsLoading, tokenAddressLoading, tokenBalanceLoading]);

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
        depositTaxRefetch(),
        estimatedRewardsRefetch(),
        tokenBalanceRefetch(),
      ]
      await Promise.all(promises);
    };
    await r();
  },[contractStateRefetch, currentRoundIdRefetch, currentRoundRefetch, currentTokenAmountRefetch, depositTaxRefetch, destinationChainSelectorRefetch, destinationContractRefetch, estimatedRewardsRefetch, tokenAddressRefetch, tokenBalanceRefetch])

  return {
    contractState,
    tokenAddress,
    destinationChainSelector,
    destinationContract,
    currentRoundId,
    currentTokenAmount,
    currentRound,
    depositTax,
    protocolReward: estimatedRewards.protocolReward,
    callerReward: estimatedRewards.callerReward,
    tokenBalance,
    isLoading,
    refetch,
  }
}

export default useGetContractState;