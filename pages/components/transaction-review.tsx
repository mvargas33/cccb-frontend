import { useMemo } from 'react';
import { BigNumber } from 'ethers';
import { useFeeData, useNetwork } from 'wagmi';
import { blockScannerTransactions } from '../../integrations/source-cccb/constants';
import { Button } from '@mui/material';
import { capitalFirstLetter, parseBigNumberToString } from '../../helpers';

const mainContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  textAlign: 'center',
  borderRadius: '15px',
  border: `1px solid grey`,
  background: 'white',
  width: '100%',
  height: 'fit-content',
  padding: '10px 20px',
  boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
  marginBottom: '1rem',
};

const fieldTitle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: '700',
  textAlign: 'left',
  margin: '10px 0px',
};

const dataContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  width: '100%',
  marginBottom: '10px',
};

const dataRow: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  justifyContent: 'space-between',
  flexGrow: 1,
};

const dataTitle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: '400',
  textAlign: 'left',
  display: 'flex',
  flexGrow: 1,
};

const dataContent: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  width: 'fit-content',
};

const usdPriceContainer: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: '400',
  textAlign: 'right',
  display: 'flex',
  width: 'fit-content',
  marginRight: '10px',
};

const ethPriceContainer: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: '700',
  textAlign: 'right',
  display: 'flex',
  width: 'fit-content',
};

const errorMessageStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: '300',
  textAlign: 'justify',
  display: 'flex',
  width: '100%',
  color: 'red',
};

const containerWithDivider: React.CSSProperties = {
  backgroundColor: 'grey',
  height: '1px',
  border: 'none',
  width: '100%',
  margin: '10px 0px',
};

interface TransactionReviewProps {
  isSuccess?: boolean;
  isLoading?: boolean;
  errors?: (object | string | unknown)[];
  sendTransaction?: () => void;
  gasLimit?: BigNumber;
  txHash?: string;
  buttonText?: string;
  titleText: string;
}

function TransactionReview({
  isSuccess,
  isLoading,
  errors,
  sendTransaction,
  gasLimit,
  txHash,
  buttonText,
  titleText,
}: TransactionReviewProps): JSX.Element {
  const {
    data: gasData,
    isLoading: gasIsLoading,
  } = useFeeData();

  const {
    chain,
  } = useNetwork();

  const networkId = chain?.id ?? 1;

  const gasPrice = useMemo(() => {
    if (!gasIsLoading && gasData){
      return gasData.gasPrice ?? 0;
    }
    return 0;
  }, [gasData, gasIsLoading]);

  const errorMessages: string[] = useMemo(() => {
    let finalMessages: string[] = [];
    let reason;
    if (errors){
      errors.forEach((error) => {
        if (typeof error === 'string'){
          reason = String(error).match(/reason:\s*([\s\S]*?)\s*Contract Call/);
          if (reason){
            finalMessages = [...finalMessages, capitalFirstLetter(reason[0])];
          }
        } else if (
          typeof error === 'object'
          && Object(error).name !== 'UserRejectedRequestError'
        ) {
          let msg = Object(error).data?.message;
          if (!msg) {
            msg = Object(error)?.reason;
          }
          if (msg) {
            finalMessages = [...finalMessages, capitalFirstLetter(msg)];
          }
        }
      });
    }
    return finalMessages;
  }, [errors]);

  const buttonTitle = useMemo(() => {
    if (buttonText) {
      return buttonText;
    }
    return 'Send Transaction';
  }, [buttonText]);

  return (
    <div style={mainContainer}>
      <div style={fieldTitle}>
        {titleText}
      </div>
      <div style={dataContainer}>
        <div style={dataRow}>
          <div style={dataTitle}>
            Gas price
          </div>
          <div style={dataContent}>
            <div style={ethPriceContainer}>
              {`${parseBigNumberToString({
                number: gasPrice,
                decimals: 9,
                precision: 1,
              })}  gwei`}
            </div>
          </div>
        </div>
        {gasLimit
        && (
        <div style={dataRow}>
          <div style={dataTitle}>
            Gas limit
          </div>
          <div style={dataContent}>
            <div style={ethPriceContainer}>
              {`${parseBigNumberToString({
                number: gasLimit,
                decimals: 0,
                precision: 0,
              })}  gas`}
            </div>
          </div>
        </div>
        )}
        {gasLimit
        && (
        <div style={dataRow}>
          <div style={dataTitle}>
            Gas fee
          </div>
          <div style={dataContent}>
            <div style={ethPriceContainer}>
              {`${parseBigNumberToString({
                number: gasLimit.mul(gasPrice),
                decimals: 18,
                precision: 6,
              })}  ${chain?.nativeCurrency.symbol}`}
            </div>
          </div>
        </div>
        )}
        <div style={containerWithDivider} />
        {errorMessages && errorMessages.length > 0 && errorMessages.map((errorMessage) => (
          <div style={errorMessageStyle} key={errorMessage}>
            {errorMessage}
          </div>
        ))}
      </div>
      <div style={dataContainer}>
        <Button
          onClick={sendTransaction}
        >
          { isSuccess ? 'Success' : buttonTitle}
        </Button>
      </div>
      {txHash && (
      <div style={containerWithDivider} />
      )}
      {txHash && (
        <Button
          onClick={() => window.open(`${blockScannerTransactions[networkId]}${txHash}`)}
        >
          See on explorer
        </Button>
      )}
    </div>
  );
}

export default TransactionReview;