import type { FC } from 'react'
import React from 'react'
import type { FixedPrice, Maybe } from 'ssesandbox04.progressive-discount-table'

import {
  useCurrentTradePolicy,
  useFixedPrices,
  useProductWithBenefits,
  withQueryProvider,
} from '../../services'
import WrapperProgressiveDiscount from './wrapper'

interface Props {
  isModal: boolean
}

const ProgressiveDiscountTable: FC<Props> = ({ isModal = false }) => {
  const {
    productName,
    selectedItem,
    benefits,
    measurementUnit,
    price,
    teasers,
  } = useProductWithBenefits()

  const { data: tradePolicyData, isLoading: isLoadingTradePolicy } =
    useCurrentTradePolicy()

  const { data: fixedPrices, loading: isLoadingFixedPrices } = useFixedPrices(
    [selectedItem?.itemId],
    tradePolicyData?.priceTables,
    tradePolicyData?.tradePolicy
  )

  if (!price || isLoadingTradePolicy || isLoadingFixedPrices) {
    return null
  }

  if (fixedPrices?.length) {
    return (
      <WrapperProgressiveDiscount
        isModal={isModal}
        title={productName}
        basePrice={price}
        measurementUnit={measurementUnit}
        benefits={fixedPrices.map((f: Maybe<FixedPrice>) => ({
          minQuantity: f?.minQuantity ?? 1,
          fixedPrice: f?.value,
        }))}
      />
    )
  }

  if (!benefits?.length) {
    if (!!teasers?.length && teasers?.[0]?.effects?.parameters?.length) {
      return (
        <WrapperProgressiveDiscount
          isModal={isModal}
          title={productName}
          basePrice={price}
          measurementUnit={measurementUnit}
          benefits={teasers.map((t) => ({
            minQuantity: t.conditions?.minimumQuantity,
            discount:
              t.effects?.parameters[0].name === 'PercentualDiscount'
                ? +t.effects?.parameters[0].value
                : 0,
          }))}
        />
      )
    }

    return null
  }

  return (
    <WrapperProgressiveDiscount
      isModal={isModal}
      title={productName}
      basePrice={price}
      measurementUnit={measurementUnit}
      benefits={benefits.map((b) => ({
        minQuantity: b?.items?.[0]?.minQuantity ?? 1,
        discount: b?.items?.[0]?.discount ?? 0,
      }))}
    />
  )
}

export default withQueryProvider(ProgressiveDiscountTable)
