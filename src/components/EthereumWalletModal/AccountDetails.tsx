import React, {  } from 'react'
//import ReactGA from 'react-ga'
//import { useDispatch } from 'react-redux'
import styled  from 'styled-components'
//import { AppDispatch } from '../../state'
// import { clearAllTransactions } from '../../state/transactions/actions'
//import { shortenHarmonyAddress } from '../../utils'
//import { AutoRow } from '../Row'
import Copy from '../AccountDetails/Copy'
// import Transaction from './Transaction'
//import { SUPPORTED_WALLETS, UserWallet } from '../../constants'
import { ReactComponent as Close } from '../../assets/images/x.svg'
//import { getHarmonyExplorerLink } from '../../utils'
import { injected, walletconnect, walletlink, fortmatic, portis } from '../../connectors'
import CoinbaseWalletIcon from '../../assets/images/coinbaseWalletIcon.svg'
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg'
import FortmaticIcon from '../../assets/images/fortmaticIcon.png'
import PortisIcon from '../../assets/images/portisIcon.png'
import Identicon from '../Identicon'
import { ButtonSecondary } from '../Button'
//import { ExternalLink as LinkIcon } from 'react-feather'
//import { ExternalLink, LinkStyledButton, TYPE } from '../../theme'

import {  useUserActiveWallet } from '../../state/user/hooks'
//import { AbstractWallet } from '@swoop-exchange/utils'
import { shortenAddress } from '../../utils'

import { useActiveHmyReact } from '../../hooks'
import {useMetaMaskAccount} from '../../bridge/ETHWallet/hooks';

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${props => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const InfoCard = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.bg3};
  border-radius: 20px;
  position: relative;
  display: grid;
  grid-row-gap: 12px;
  margin-bottom: 20px;
`

const AccountGroupingRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  color: ${({ theme }) => theme.text1};

  div {
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
  }
`

const AccountSection = styled.div`
  background-color: ${({ theme }) => theme.bg1};
  padding: 0rem 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 0rem 1rem 1.5rem 1rem;`};
`

const YourAccount = styled.div`
  h5 {
    margin: 0 0 1rem 0;
    font-weight: 400;
  }

  h4 {
    margin: 0;
    font-weight: 500;
  }
`


const AccountControl = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 0;
  width: 100%;

  font-weight: 500;
  font-size: 1.25rem;

  a:hover {
    text-decoration: underline;
  }

  p {
    min-width: 0;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`


const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`

const WalletName = styled.div`
  width: initial;
  font-size: 0.825rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text3};
`

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`


const WalletAction = styled(ButtonSecondary)`
  width: fit-content;
  font-weight: 400;
  margin-left: 8px;
  font-size: 0.825rem;
  padding: 4px 6px;
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

const MainWalletAction = styled(WalletAction)`
  color: ${({ theme }) => theme.primary1};
`


interface AccountDetailsProps {
  toggleWalletModal: () => void
  pendingTransactions: string[]
  confirmedTransactions: string[]
  ENSName?: string
  openOptions: () => void
}

export default function AccountDetails({
                                         toggleWalletModal,

                                         ENSName,

                                       }: AccountDetailsProps) {
  const {  account, bech32Address } = useActiveHmyReact();
  //const theme = useContext(ThemeContext)
  //const dispatch = useDispatch<AppDispatch>()

  //const [, setUserWallet] = useUserWallet()

  const connector = useUserActiveWallet()

  function formatConnectorName() {

    return <WalletName>Connected with MetaMask</WalletName>
  }

  /*const tryDeactivation = async (connector: AbstractWallet | undefined) => {
    console.log('tryDeactivation')
  }*/

  function getStatusIcon() {
    if (connector === injected) {
      return (
        <IconWrapper size={16}>
          <Identicon />
        </IconWrapper>
      )
    } else if (connector === walletconnect) {
      return (
        <IconWrapper size={16}>
          <img src={WalletConnectIcon} alt={'wallet connect logo'} />
        </IconWrapper>
      )
    } else if (connector === walletlink) {
      return (
        <IconWrapper size={16}>
          <img src={CoinbaseWalletIcon} alt={'coinbase wallet logo'} />
        </IconWrapper>
      )
    } else if (connector === fortmatic) {
      return (
        <IconWrapper size={16}>
          <img src={FortmaticIcon} alt={'fortmatic logo'} />
        </IconWrapper>
      )
    } else if (connector === portis) {
      return (
        <>
          <IconWrapper size={16}>
            <img src={PortisIcon} alt={'portis logo'} />
            <MainWalletAction
              onClick={() => {
                portis.portis.showPortis()
              }}
            >
              Show Portis
            </MainWalletAction>
          </IconWrapper>
        </>
      )
    }
    return null
  }


  const accountMetaMask = useMetaMaskAccount()

  return (
    <>
      <UpperSection>
        <CloseIcon onClick={toggleWalletModal}>
          <CloseColor />
        </CloseIcon>
        <HeaderRow>Account</HeaderRow>
        <AccountSection>
          <YourAccount>
            <InfoCard>
              <AccountGroupingRow>
                {formatConnectorName()}
                <div>
                 {/* {connector && connector !== injected && connector !== walletlink && (
                    <WalletAction
                      style={{ fontSize: '.825rem', fontWeight: 400, marginRight: '8px' }}
                      disabled={true}
                      onClick={() => {
                        tryDeactivation(connector);
                      }}
                    >
                      Disconnect
                    </WalletAction>
                  )}*/}
                 {/* <WalletAction
                    style={{ fontSize: '.825rem', fontWeight: 400 }}
                    onClick={() => {
                      openOptions()
                    }}
                  >
                    Change
                  </WalletAction>*/}
                </div>
              </AccountGroupingRow>
              <AccountGroupingRow id="web3-account-identifier-row">
                <AccountControl>
                  {ENSName ? (
                    <>
                      <div>
                        {getStatusIcon()}
                        <p> {ENSName}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        {getStatusIcon()}
                        <p> {accountMetaMask && shortenAddress(accountMetaMask)}</p>
                      </div>
                    </>
                  )}
                </AccountControl>
              </AccountGroupingRow>
              <AccountGroupingRow>
                {ENSName ? (
                  <>
                    <AccountControl>
                      <div>
                        {account && (
                          <Copy toCopy={account}>
                            <span style={{ marginLeft: '4px' }}>Copy Address</span>
                          </Copy>
                        )}
                       {/* {chainId && account && bech32Address && (
                          <AddressLink
                            hasENS={!!ENSName}
                            isENS={true}
                            href={chainId && getHarmonyExplorerLink(wrapper, bech32Address, 'address')}
                          >
                            <LinkIcon size={16} />
                            <span style={{ marginLeft: '4px' }}>View on Harmony Explorer</span>
                          </AddressLink>
                        )}*/}
                      </div>
                    </AccountControl>
                  </>
                ) : (
                  <>
                    <AccountControl>
                      <div>
                        {account && bech32Address && (
                          <Copy toCopy={bech32Address}>
                            <span style={{ marginLeft: '4px' }}>Copy Address</span>
                          </Copy>
                        )}
                       {/* {chainId && account && bech32Address && (
                          <AddressLink
                            hasENS={!!ENSName}
                            isENS={false}
                            href={getHarmonyExplorerLink(wrapper, bech32Address, 'address')}
                          >
                            <LinkIcon size={16} />
                            <span style={{ marginLeft: '4px' }}>View on Harmony Explorer</span>
                          </AddressLink>
                        )}*/}
                      </div>
                    </AccountControl>
                  </>
                )}
              </AccountGroupingRow>
            </InfoCard>
          </YourAccount>
        </AccountSection>
      </UpperSection>
     {/* {!!pendingTransactions.length || !!confirmedTransactions.length ? (
        <LowerSection>
          <AutoRow mb={'1rem'} style={{ justifyContent: 'space-between' }}>
            <TYPE.body>Recent Transactions</TYPE.body>
            <LinkStyledButton onClick={clearAllTransactionsCallback}>(clear all)</LinkStyledButton>
          </AutoRow>
          {renderTransactions(pendingTransactions)}
          {renderTransactions(confirmedTransactions)}
        </LowerSection>
      ) : (
        <LowerSection>
          <TYPE.body color={theme.text1}>Your transactions will appear here...</TYPE.body>
        </LowerSection>
      )}*/}
    </>
  )
}
