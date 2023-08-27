import React from 'react'

import { useProductWithBenefits } from '../../hooks/useProductWithBenefits'
import WrapperProgressiveDiscount from './wrapper'

const ProgressiveDiscountTable = () => {
  const { benefits, measurementUnit, price, teasers } = useProductWithBenefits()

  if (!price) {
    return null
  }

  if (!benefits?.length) {
    if (!!teasers?.length && teasers?.[0]?.effects?.parameters?.length) {
      return (
        <WrapperProgressiveDiscount
          isModal
          title={teasers?.[0].name}
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
      basePrice={price}
      measurementUnit={measurementUnit}
      benefits={benefits.map((b) => ({
        minQuantity: b?.items?.[0]?.minQuantity ?? 1,
        discount: b?.items?.[0]?.discount ?? 0,
      }))}
    />
  )
}

export default ProgressiveDiscountTable
