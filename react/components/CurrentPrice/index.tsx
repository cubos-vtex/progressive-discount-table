import type { FC } from 'react'
import React from 'react'
import { FormattedMessage } from 'react-intl'
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
  showMinPrice?: boolean
}

const CurrentPrice = ({ LoadingContent, showMinPrice = false }: Props) => {
  const handles = useCssHandles(['currentPriceContainer', 'startPrice'])

  const { data: tradePolicyData, isLoading: isLoadingTradePolicy } =
    useCurrentTradePolicy()

  const { price, hasDifferentPrices, minPrice, selectedItem } =
    useProductWithBenefits()

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

  if (showMinPrice && hasDifferentPrices) {
    return (
      <div className={`flex flex-column ${handles.currentPriceContainer}`}>
        <span className={handles.startPrice}>
          <FormattedMessage id="store/start-price" />
        </span>
        <FormattedCurrency value={minPrice} />
      </div>
    )
  }

  return (
    <div className={handles.currentPriceContainer}>
      <FormattedCurrency value={price} />
    </div>
  )
}

export default withQueryProvider(CurrentPrice)
