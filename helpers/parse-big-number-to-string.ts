import {
  BigNumber,
  BigNumberish,
} from 'ethers';
import isBigNumberish from './is-big-numberish';

interface ParseBigNumberToString {
  number: BigNumberish;
  decimals: number;
  precision: number;
}

/**
 * Parse a 'BigNumber' that has 'decimals' to a readable string with a sepating coma,
 * for the 'precision' specified
 *
 * Example: 1234567890, with 6 decimals = 1234.567890, with 2 precision = 1234.56
 */
const parseBigNumberToString = ({
  number,
  decimals,
  precision,
}: ParseBigNumberToString): string => {
  if (!isBigNumberish(number)) {
    throw new Error('Invalid number type');
  }
  const bigNumberValue = BigNumber.from(number.toString());
  let realPrecision = precision;
  if (precision > decimals) {
    realPrecision = decimals;
  }
  const base = bigNumberValue.toString();
  // Decimals > base.length
  // 345 -> 0.0000034567 -> 0.000034
  if (decimals > base.length) {
    return `0.${'0'.repeat(decimals - base.length)}${base}`.substring(0, realPrecision + 2);
  }
  // Decimals <= base.length
  // 123456789 -> 0.123456789 || 123.456789, and then apply realPrecision
  const baseString = bigNumberValue.div(BigNumber.from(10)
    .pow(decimals - realPrecision)).toString();
  const separatorIndex = baseString.length - realPrecision;
  let left = baseString.substring(0, separatorIndex);
  if (left === '') {
    left = `0${left}`;
  }
  const right = baseString.substring(separatorIndex, baseString.length);
  if (realPrecision !== 0) {
    return `${left}.${right}`;
  }
  return left;
};

export default parseBigNumberToString;