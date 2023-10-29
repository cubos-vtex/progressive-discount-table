import { useProduct } from 'vtex.product-context'
import type { ProductContextState } from 'vtex.product-context/react/ProductTypes'

import { distinctBenefits } from '../helpers/benefits'
import { getDefaultSeller } from '../helpers/seller'

export interface Benefit {
  teaserType?: string
  items?: Array<{
    minQuantity?: number
    discount?: number
  }>
}

interface ProductWithBenefits {
  product?: {
    benefits?: Benefit[]
  }
}

type ProductContextWithBenefits =
  | (Partial<ProductContextState> & ProductWithBenefits)
  | undefined

export const useProductWithBenefits = () => {
  const productContextValue = useProduct() as ProductContextWithBenefits
  const benefits = distinctBenefits(
    productContextValue?.product?.benefits?.filter(
      (b) => b?.teaserType === 'Catalog'
    )
  )

  const productName = productContextValue?.product?.productName

  const sortedPrices = productContextValue?.product?.items
    .map((item) => {
      const seller = getDefaultSeller(item.sellers)

      return seller?.commertialOffer?.Price ?? 0
    })
    .sort((a, b) => a - b)

  const minPrice = sortedPrices?.[0] ?? 0
  const hasDifferentPrices = sortedPrices?.some((price) => price !== minPrice)
  const selectedItem = productContextValue?.selectedItem
  const measurementUnit = selectedItem?.measurementUnit ?? ''
  const seller = getDefaultSeller(selectedItem?.sellers)
  const commertialOffer = seller?.commertialOffer
  const price = commertialOffer?.Price
  const teasers = commertialOffer?.teasers

  return {
    productName,
    selectedItem,
    benefits,
    measurementUnit,
    minPrice,
    hasDifferentPrices,
    price,
    teasers,
  }
}
