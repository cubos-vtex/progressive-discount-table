import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedCurrency } from 'vtex.format-currency'
import { useProduct } from 'vtex.product-context'

import styles from './style.css'

const ProgressiveDiscountInfo = () => {
  const handles = useCssHandles(Object.keys(styles))
  const productContextValue = useProduct()

  const {
    selectedItem: {
      measurementUnit,
      sellers: [
        {
          commertialOffer: { Price, teasers },
        },
      ],
    },
  } = productContextValue

  const hasTeasers = teasers?.length && teasers[0]?.effects?.parameters?.length

  if (hasTeasers) {
    return (
      <div className={`${handles.containerInfo} c-muted-1`}>
        <div className="f7 fw3 ttu mb3">
          <FormattedMessage id="store/from-price" />{' '}
          {teasers[0].conditions?.minimumQuantity} {measurementUnit}:
        </div>
        {teasers[0].effects?.parameters[0].name === 'PercentualDiscount' && (
          <span>
            <FormattedCurrency
              value={
                +Price * (1 - +teasers[0].effects?.parameters[0].value / 100)
              }
            />{' '}
            / {measurementUnit}
          </span>
        )}
      </div>
    )
  }

  return null
}

export default ProgressiveDiscountInfo
