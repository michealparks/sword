/**
 * Credit: https://github.com/gsimone/things#bitmask
 */
type Bit = 0 | 1

const create = (bits: Bit[]) => {
  return Number.parseInt(bits.reverse().join(''), 2)
}

const getBit = (integer: number, index: number) => {
  return integer & (1 << index) ? 1 : 0
}

const setBit = (integer: number, index: number, value: Bit) => {
  const mask = 1 << index
  return value === 1 ? integer | mask : integer & ~mask
}

const toggleBit = (integer: number, index: number) => {
  return integer ^ (1 << index)
}

const clearBit = (integer: number, index: number) => {
  return integer & ~(1 << index)
}

const getBits = (integer: number, size = 8): Bit[] => {
  return integer
    .toString(2)
    .padStart(size, '0')
    .split('')
    .reverse()
    .map(Number) as Bit[]
}

export const bitmask = {
  clearBit,
  create,
  getBit,
  getBits,
  setBit,
  toggleBit,
}
