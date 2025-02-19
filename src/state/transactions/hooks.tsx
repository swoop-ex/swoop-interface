//import { TransactionResponse } from '@ethersproject/providers'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, AppState } from '../index'
import { addTransaction } from './actions'
import { TransactionDetails } from './reducer'

import { useActiveHmyReact } from '../../hooks'

// helper that can take a ethers library transaction response and add it to the list of transactions
export function useTransactionAdder(): (
  response: any,
  customData?: { summary?: string; approval?: { tokenAddress: string; spender: string } }
) => void {
  const { account, chainId } = useActiveHmyReact();
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(
    (
      response: any,
      { summary, approval }: { summary?: string; approval?: { tokenAddress: string; spender: string } } = {}
    ) => {
      if (!account) return
      if (!chainId) return

      const hash = response.transaction.receipt.transactionHash
      if (!hash) {
        throw Error('No transaction hash found.')
      }
      dispatch(addTransaction({ hash, from: account, chainId, approval, summary }))
    },
    [dispatch, chainId, account]
  )
}

// returns all the transactions for the current chain
export function useAllTransactions(): { [txHash: string]: TransactionDetails } {
  const { chainId } = useActiveHmyReact()

  const userWallet = useSelector<AppState, AppState['user']['userWallet']>(state => {
    return state.user.userWallet
  })

  const state = useSelector<AppState, AppState['transactions']>(state => state.transactions)

  const transactions = {}

  if (chainId && state[chainId]) {
    for (const key in state[chainId]) {
      if (state[chainId][key].from === userWallet.address) {
        transactions[key] = state[chainId][key]
      }
    }
  }

  return transactions
}

export function useIsTransactionPending(transactionHash?: string): boolean {
  const transactions = useAllTransactions()

  if (!transactionHash || !transactions[transactionHash]) return false

  return !transactions[transactionHash].receipt
}

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
export function isTransactionRecent(tx: TransactionDetails): boolean {
  return new Date().getTime() - tx.addedTime < 86_400_000
}

// returns whether a token has a pending approval transaction
export function useHasPendingApproval(tokenAddress: string | undefined, spender: string | undefined): boolean {
  const allTransactions = useAllTransactions()
  return useMemo(
    () =>
      typeof tokenAddress === 'string' &&
      typeof spender === 'string' &&
      Object.keys(allTransactions).some(hash => {
        const tx = allTransactions[hash]
        if (!tx) return false
        if (tx.receipt) {
          return false
        } else {
          const approval = tx.approval
          if (!approval) return false
          return approval.spender === spender && approval.tokenAddress === tokenAddress && isTransactionRecent(tx)
        }
      }),
    [allTransactions, spender, tokenAddress]
  )
}
