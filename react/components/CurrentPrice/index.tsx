import type { FC } from 'react'
import React from 'react'
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

  const { data: fixedPrices, isLoading: isLoadingFixedPrices } = useFixedPrices(
    selectedItem?.itemId,
    tradePolicyData?.priceTables,
    tradePolicyData?.tradePolicy
  )

  if (!price || isLoadingTradePolicy || isLoadingFixedPrices) {
    return LoadingContent ? <LoadingContent /> : null
  }

  if (fixedPrices?.length) {
    const fixedPrice = fixedPrices.find((f) => f.minQuantity === 1)

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
