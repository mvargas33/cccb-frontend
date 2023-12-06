import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import ContractState from './components/contract-state';
import { Divider, Grid, styled } from '@mui/material';
import Particles from "react-tsparticles";
import type { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim"; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.
import { useCallback } from 'react';


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
  zIndex: 1,
});

const ConnectButtonContainer = styled(Grid)({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  margin: '2rem 0',
  zIndex: 1,
});

const MainTitleContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  color: 'white',
  fontSize: '4rem',
  fontWeight: 800,
  margin: '7rem 0',
  zIndex: 1,
});

const MainTitle = styled('div')({
  fontSize: '4rem',
  fontWeight: 800,
  width: '100%',
});

const Subtitle = styled('div')({
  fontSize: '2rem',
  fontWeight: 200,
  width: '100%',
});

const ParticleBackground = styled(Particles)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 0, // Set the z-index to be behind other components
});

const Home: NextPage = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    console.log(engine);

    // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    //await loadFull(engine);
    await loadSlim(engine);
}, []);

const particlesLoaded = useCallback(async (container: Container | undefined) => {
    await console.log(container);
}, []);

  return (
    <MainContainer>
      
        <MainTitleContainer>
          <MainTitle>Save up to 50% in bridges</MainTitle>
          <Subtitle>Thanks to Chainlink CCIP</Subtitle>
        </MainTitleContainer>
        <Divider/>
        <ConnectButtonContainer>
          <ConnectButton />
        </ConnectButtonContainer>
        <ContractStatesContainer>
          <ContractState/>
          <ContractState/>
        </ContractStatesContainer>
        <ParticleBackground
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                fullScreen: true,
                background: {
                    color: {
                        value: "#111111",
                    },
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onClick: {
                            enable: false,
                            mode: "push",
                        },
                        onHover: {
                            enable: false,
                            mode: "repulse",
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4,
                        },
                    },
                },
                particles: {
                    color: {
                        value: "#ffffff",
                    },
                    links: {
                        color: "#ffffff",
                        distance: 150,
                        enable: true,
                        opacity: 0.5,
                        width: 1,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 1,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 700,
                        },
                        value: 70,
                    },
                    opacity: {
                        value: 0.2,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 5 },
                    },
                },
                detectRetina: true,
            }}
        />
    </MainContainer>
  );
};

export default Home;
