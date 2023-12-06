import React, { useEffect, useState } from 'react';
import { 
  Paper, 
  Grid,
  styled,
  Divider,
  CircularProgress
} from '@mui/material';
import Image from 'next/image';
import ethereumIcon from '../assets/avax.svg';


const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
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
  fontWeight: 'bold',
});

const StyledContainer = styled(Grid)({
  minWidth: '30rem'
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

const ContractState = () => {
  const [countdown, setCountdown] = useState(5);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 5));
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0) {
      // Perform your refetch here
      // For demonstration purposes, simulate a network request with setTimeout
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setCountdown(5); // Reset countdown after refetch
      }, 2000); // Simulating a 2-second delay for the request
    }
  }, [countdown]);
  
  const infoData = [
    { title: 'Token', value: '0x00' },
    { title: 'Contract State', value: 'LOCKED' },
    { title: 'Round ID', value: '1' },
    { title: 'Number of Participants', value: '4' },
    { title: 'ETH Raised', value: '0.002 E' },
    { title: 'Cost of Bridge', value: '0.0018 E' },
    { title: 'Reward for Bridging', value: '0.0002 E' },
    { title: 'CCIP Message ID', value: 'Message ID' },
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
            <CustomText textColor={info.title === 'Contract State' ? (info.value === 'LOCKED' ? 'red' : 'green') : 'inherit'}>{info.value}</CustomText>
          </StyledRow>
        ))}
      </StyledContainer>
    </StyledPaper>
  );
};

export default ContractState;
