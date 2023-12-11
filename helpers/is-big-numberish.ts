import {
  BigNumber,
  BigNumberish,
} from 'ethers';

function isHexString(value: unknown, length?: number): boolean {
  if (typeof (value) !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }
  if (length && value.length !== 2 + 2 * length) { return false; }
  return true;
}

/**
 * Returns true if the value provided is a valid input for BigNumber.from()
 * @param value   Any value
 * @returns       True if value is converatble to big number
 */
export default function isBigNumberish(value: unknown): value is BigNumberish {
  return (value != null) && (
    BigNumber.isBigNumber(value)
      || (typeof (value) === 'number' && (value % 1) === 0)
      || (typeof (value) === 'string' && !!value.match(/^-?[0-9]+$/))
      || isHexString(value)
      || (typeof (value) === 'bigint')
  );
}