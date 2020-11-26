export const ERC20ABI = [
  {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
  },
];

// in case we want to display balances for ethereum.
export const ethereumTokens = {
  'kovan': {
    'ETH': {
      harmonyAddress: '0x1E120B3b4aF96e7F394ECAF84375b1C661830013'
    },
    'LINK': {
      ethereumAddress: '0x067240cf9e5a5d0fdc9eaa81a68261636237b9ef',
      harmonyAddress: '0x2C6e26B2faD89bc52d043e78E3D980A08af0Ce88'
    },
    'BUSD': {
      ethereumAddress: '0xb0e18106520d05ada2c7fcb1a95f7db5e3f28345',
      harmonyAddress: '0x1E120B3b4aF96e7F394ECAF84375b1C661830013'
    }
  },
  'mainnet': {
  }
}