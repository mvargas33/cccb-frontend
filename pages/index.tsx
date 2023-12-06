import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import ContractState from './components/contract-state';
import { Divider, Grid, styled, Typography } from '@mui/material';

const MainContainer = styled(Grid)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'flex-start',
  textAlign: 'center',
  paddingBottom: '5rem',
});

const ContractStatesContainer = styled(Grid)({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  flexWrap: 'no-wrap'
});

const ConnectButtonContainer = styled(Grid)({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  flexWrap: 'no-wrap',
  margin: '2rem 0',
});

const MainTitleContainer = styled(Typography)({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  fontSize: '4rem',
  fontWeight: 800,
  margin: '7rem 0'
});

const MainTitle = styled(Typography)({
  fontSize: '4rem',
  fontWeight: 800,
  width: '100%',
});

const Subtitle = styled(Typography)({
  fontSize: '2rem',
  fontWeight: 200,
  width: '100%',
});


const Home: NextPage = () => {
  return (
    <MainContainer>
        <MainTitleContainer>
          <MainTitle>Save up to 50% in bridges</MainTitle>
          <Subtitle>With SharedBridge</Subtitle>
        </MainTitleContainer>
        <Divider/>
        <ConnectButtonContainer>
          <ConnectButton />
        </ConnectButtonContainer>
        <ContractStatesContainer>
          <ContractState/>
          <ContractState/>
        </ContractStatesContainer>
        
    </MainContainer>
  );
};

export default Home;
