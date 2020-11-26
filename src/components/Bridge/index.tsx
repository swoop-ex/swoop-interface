import Modal from '../ModalBridge';
import {BridgeSDK, ExchangeBlock} from 'bridge-ui-sdk';
import React, {useEffect, useState} from 'react';
import {useActiveHmyReact} from '../../hooks';
import {useMetaMaskAccount} from '../../bridge/ETHWallet/hooks';
// import {useETHBalances} from '../../state/wallet/hooks';
import {useAllTokens} from '../../hooks/Tokens';
import {mainnet as mainnetConfig} from 'bridge-sdk/lib/configs/mainnet';
import {testnet as testnetConfig} from 'bridge-sdk/lib/configs/testnet';
import styled from 'styled-components';
import {
  toBech32,
} from '@harmony-js/crypto'


const Link = styled.span`
  span, a, a:visited {
  text-decoration: none;
  cursor: pointer;
  outline: none;
  ${({theme}) => `color: ${theme.primaryText1}`};
  }
`;


const Bridge = () => {
  const {account, chainId} = useActiveHmyReact();

  const bech32Address = account ? toBech32(account) : ''

  const [showBridge, setShowBridge] = useState(false);
  const ETHAccount = useMetaMaskAccount();
  //const ETHBalances = useAllEthereumBalances(ETHAccount);
  // console.log({account})

  const bridgeChain = chainId === 1 ? 'mainnet' : 'testnet';

  // const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? ''];
  const HRC20Tokens = Object.keys(useAllTokens());
  const [bridgeTokenList, setBridgeTokenList] = useState<any[]>([]);

  useEffect(() => {
    try {
      const bridgeSdk = new BridgeSDK({logLevel: 0});
      const config = chainId === 1 ? mainnetConfig : testnetConfig;
      bridgeSdk.init(config).then(() => {
        bridgeSdk.api
          .getTokensInfo({page: 0, size: 1000})
          .then((res) => setBridgeTokenList(res.content));
      });
    } catch (e) {
    }
  }, [chainId]);

  const customTokens: any[] = bridgeTokenList.filter(({hrc20Address}) => HRC20Tokens.includes(hrc20Address));

  return (
    <>
      <span onClick={() => setShowBridge(!showBridge)}>Bridge</span>
      <Modal isOpen={showBridge} onDismiss={() => setShowBridge(false)} width={560}>
        <div style={{width: '100%', padding: '15px'}}>
          Harmony Bridge. The stand-alone version is available&nbsp;
          <Link>
            <a rel="noopener noreferrer" target="_blank" href="https://bridge.harmony.one/">here</a>
          </Link>
        </div>
        <ExchangeBlock tokens={customTokens} addressOneWallet={bech32Address} network={bridgeChain}
                       addressMetamask={ETHAccount} />
      </Modal>
    </>
  );
};

export default Bridge;