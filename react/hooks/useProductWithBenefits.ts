import { useProduct } from 'vtex.product-context'
import type { ProductContextState } from 'vtex.product-context/react/ProductTypes'

interface Benefit {
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

  const benefits = productContextValue?.product?.benefits?.filter(
    (b) => b?.teaserType === 'Catalog'
  )

  const selectedItem = productContextValue?.selectedItem
  const measurementUnit = selectedItem?.measurementUnit ?? ''
  const price = selectedItem?.sellers?.[0]?.commertialOffer?.Price
  const teasers = selectedItem?.sellers?.[0]?.commertialOffer?.teasers

  return {
    benefits,
    measurementUnit,
    price,
    teasers,
  }
}
