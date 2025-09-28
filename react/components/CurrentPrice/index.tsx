import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'
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
  const [listPriceColor, setListPriceColor] = React.useState('')

  const { data: tradePolicyData, isLoading: isLoadingTradePolicy } =
    useCurrentTradePolicy()

  const { price, listPrice, hasDifferentPrices, minPrice, skuIds } =
    useProductWithBenefits()

  const { data: fixedPrices, loading: isLoadingFixedPrices } = useFixedPrices(
    skuIds,
    tradePolicyData?.priceTables,
    tradePolicyData?.tradePolicy
  )

  const listPriceRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (listPriceRef.current && listPrice) {
      const listPriceColorVar = getComputedStyle(listPriceRef.current)
        .getPropertyValue('--black-medium')
        .trim()

      setListPriceColor(listPriceColorVar)
    }
  }, [listPrice])

  if (!price || isLoadingTradePolicy || isLoadingFixedPrices) {
    return LoadingContent ? <LoadingContent /> : null
  }

  if (fixedPrices?.length) {
    const [fixedPrice] = fixedPrices.sort(
      (a: Maybe<FixedPrice>, b: Maybe<FixedPrice>) =>
        (a?.value ?? 0) - (b?.value ?? 0)
    )

    if (fixedPrice) {
      return (
        <div className="flex flex-column">
          {listPrice &&
            listPrice === price &&
            listPrice > fixedPrice.value &&
            (fixedPrice.minQuantity ?? 0) > 1 && (
              <span
                ref={listPriceRef}
                className="strike t-body c-muted-1"
                {...(listPriceColor && { style: { color: listPriceColor } })}
              >
                <FormattedCurrency value={listPrice} />
              </span>
            )}
          <div className={`flex flex-column ${handles.currentPriceContainer}`}>
            {(fixedPrice.minQuantity ?? 0) > 1 && (
              <span className={handles.startPrice}>
                <FormattedMessage id="store/start-price" />
              </span>
            )}
            <FormattedCurrency value={fixedPrice.value} />
          </div>
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
