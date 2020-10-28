import MULTICALL_ABI from './abi.json'

const { ChainID } = require("@harmony-js/utils");

const MULTICALL_NETWORKS: { [chainId in typeof ChainID]: string } = {
  [ChainID.HmyMainnet]: '0xfaA0Aca7e9b9564fB33170946D3F48d4B7Db738D', // Deployed Wed 28 Oct 2020 08:25:39 AM UTC
  [ChainID.HmyTestnet]: '0x4BAC6E1dAA31b877147e9465d73DCf823A54828C', // Deployed Wed 28 Oct 2020 08:57:49 AM UTC
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
