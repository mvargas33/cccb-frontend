import React, { useCallback, useEffect, useState } from 'react';
import { 
  Paper, 
  Grid,
  styled,
  Divider,
  CircularProgress,
  Button
} from '@mui/material';
import Image from 'next/image';
import ethereumIcon from '../assets/ethereum.svg';
import { useApproveBridge, useGetContractState, useDeposit } from '../../integrations/source-cccb/hooks';
import useBridge from '../../integrations/source-cccb/hooks/use-bridge';
import TransactionReview from './transaction-review';
import { sepoliaChainId, sourceCCCBSepoliaAddress } from '../../integrations/source-cccb/constants';
import { useChainId } from 'wagmi';


const StyledPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  maxWidth: '40rem',
}));

const HeaderContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '16px',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  height: '3rem'
});

const ImageTitleContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  height: '3rem',
});

const StyledDivider = styled(Divider)({
  margin: '1rem 0',
});

const Name = styled('span')({
  display: 'flex',
  justifyContent: 'flex-start',
  fontWeight: 'bold',
  flexGrow: 1,
});

const StyledContainer = styled(Grid)({
  width: '100%',
  // minWidth: '20rem',
  // maxWidth: '30rem',
})

const CountdownContainer = styled(Grid)({
  display: 'flex',
  maxWidth: '7rem',
  alignItems: 'center',
  justifyContent: 'flex-end',
  textAlign: 'center',
  fontSize: '0.8rem',
  fontWeight: 400
})

const StyledRow = styled(Grid)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexGrow: 1,
  justifyContent: 'space-between',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const LoaderContainer = styled(Grid)({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  height: '30%',
  width: '100%', // Ensure the grid takes up the full width
});

interface CustomTextProps {
  textColor?: 'green' | 'red' | 'inherit';
}

const CustomText = styled('span')<CustomTextProps>(({ theme, textColor }) => ({
  color: textColor,
}));

const SourceContractState = () => {
  const network = useChainId();
  const isSepoliaNetwork = network === sepoliaChainId;

  const {
    contractState,
    tokenAddress,
    destinationChainSelector,
    destinationContract,
    currentRoundId,
    currentTokenAmount,
    currentRound,
    depositTax,
    protocolReward,
    callerReward,
    tokenBalance,
    refetch,
  } = useGetContractState();

  const {
    errors,
    sendTransaction,
    isSuccess,
    isLoading,
    data,
  } = useBridge();

  const {
    errors: depositErrors,
    sendTransaction: sendDeposit,
    isSuccess: isDepositSuccess,
    isLoading: isDepositLoading,
    data: depositData,
  } = useDeposit({ tax: depositTax });

  const {
    errors: approveErrors,
    sendTransaction: sendApprove,
    isSuccess: isApproveSuccess,
    isLoading: isApproveLoading,
    data: approveData,
  } = useApproveBridge({ tax: depositTax });
  
  const [countdown, setCountdown] = useState(3);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 3));
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [countdown, refetch]);

  useEffect(() => {
    const rf = async () => {
      if (countdown === 0) {
        setLoading(true);
        await refetch();
        setLoading(false);
      }
    }
    rf();
  }, [countdown, refetch]);
  
  const infoData = [
    { title: 'Contract', value: sourceCCCBSepoliaAddress},
    { title: 'BnP', value: tokenAddress },
    { title: 'BnP balance', value: tokenBalance },
    { title: 'Contract State', value: contractState },
    { title: 'Destination Chain', value: destinationChainSelector},
    { title: 'Destination contract', value: destinationContract},
    { title: 'Round ID', value: currentRoundId },
    { title: 'Token amout raised', value: currentTokenAmount },
    { title: 'Number of Participants', value: currentRound.participants.length },
    
    { title: 'Deposit tax (ETH)', value: depositTax },
    { title: 'Protocol reward (ETH)', value: protocolReward },
    { title: 'Caller reward (ETH)', value: callerReward },
  ];

  return (
    <StyledPaper>
      <HeaderContainer>
        <ImageTitleContainer>
          <Image
            src={ethereumIcon}
            alt="Blockchain Icon"
            height={40}
            width={40}
            style={{ marginRight: '0.8rem'}}
          />
          <span>Contract in Sepolia</span>
        </ImageTitleContainer>
        <CountdownContainer container direction="column">
        {loading ? (
          <LoaderContainer>
            <CircularProgress />
          </LoaderContainer>
            
        ) : (
            <span>{`Refreshing in ${countdown}s`}</span>
        )}
        {/* {countdown === 1 && !loading && (
            <span>Fetching data...</span>
        )} */}
        </CountdownContainer>
      </HeaderContainer>
      
      <StyledDivider />
      <StyledContainer container direction="column">
        {infoData.map((info, index) => (
          <StyledRow item key={index} container alignItems="center">
            <Name>{info.title}</Name>
            <CustomText textColor={info.title === 'Contract State' ? (info.value === 'BLOCKED' ? 'red' : 'green') : 'inherit'}>{info.value}</CustomText>
          </StyledRow>
        ))}
      </StyledContainer>
      <StyledDivider />
      <StyledContainer container direction="column">
        <Name>Participants</Name>
        {currentRound.participants.map((participant, index) => (
          <StyledRow item key={index} container alignItems="center">
            <Name>{participant}</Name>
            <CustomText>{currentRound.balances[index]}</CustomText>
          </StyledRow>
        ))}
      </StyledContainer>
      {isSepoliaNetwork &&
      <>
      <StyledDivider/>
      <TransactionReview
        errors={approveErrors}
        sendTransaction={sendApprove}
        isSuccess={isApproveSuccess}
        isLoading={isApproveLoading}
        txHash={approveData?.hash}
        buttonText="Approve"
        titleText="Approve for 1000 wei of BnP"
      />
      <TransactionReview
        errors={depositErrors}
        sendTransaction={sendDeposit}
        isSuccess={isDepositSuccess}
        isLoading={isDepositLoading}
        txHash={depositData?.hash}
        buttonText="Deposit"
        titleText="Deposit 100 wei of BnP"
      />
      <TransactionReview
        errors={errors}
        sendTransaction={sendTransaction}
        isSuccess={isSuccess}
        isLoading={isLoading}
        txHash={data?.hash}
        buttonText="Bridge all"
        titleText="Bridge"
      />
      </>
}
    </StyledPaper>
  );
};

export default SourceContractState;
