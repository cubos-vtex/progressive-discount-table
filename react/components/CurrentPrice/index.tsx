import type { FC } from 'react'
import React from 'react'
import type { FixedPrice, Maybe } from 'ssesandbox04.progressive-discount-table'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedCurrency } from 'vtex.format-currency'

import {
  useCurrentTradePolicy,
  useFixedPrices,
  useProductWithBenefits,
  withQueryProvider,
} from '../../services'

type Props = {
  LoadingContent?: FC<unknown>
}

const CurrentPrice = ({ LoadingContent }: Props) => {
  const handles = useCssHandles(['currentPriceContainer'])

  const { data: tradePolicyData, isLoading: isLoadingTradePolicy } =
    useCurrentTradePolicy()

  const { price, selectedItem } = useProductWithBenefits()

  const { data: fixedPrices, loading: isLoadingFixedPrices } = useFixedPrices(
    selectedItem?.itemId,
    tradePolicyData?.priceTables,
    tradePolicyData?.tradePolicy
  )

  if (!price || isLoadingTradePolicy || isLoadingFixedPrices) {
    return LoadingContent ? <LoadingContent /> : null
  }

  if (fixedPrices?.length) {
    const fixedPrice = fixedPrices.find(
      (f: Maybe<FixedPrice>) => f?.minQuantity === 1
    )

    if (fixedPrice) {
      return (
        <div className={handles.currentPriceContainer}>
          <FormattedCurrency value={fixedPrice.value} />
        </div>
      )
    }
  }

  return (
    <div className={handles.currentPriceContainer}>
      <FormattedCurrency value={price} />
    </div>
  )
}

export default withQueryProvider(CurrentPrice)
