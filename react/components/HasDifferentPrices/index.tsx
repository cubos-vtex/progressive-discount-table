import React from 'react'

import { useProductWithBenefits } from '../../services'

type Props = {
  Then?: React.FC<unknown>
  Else?: React.FC<unknown>
}

const HasDifferentPrices = ({ Then, Else }: Props) => {
  const { hasDifferentPrices } = useProductWithBenefits()

  if (hasDifferentPrices) {
    return !!Then && <Then />
  }

  return !!Else && <Else />
}

export default HasDifferentPrices
