import type { Benefit } from '../services/useProductWithBenefits'

export const distinctBenefits = (benefits?: Benefit[]) => {
  const uniqueMinQuantity = new Set()

  const uniqueBenefits = benefits?.map((b) => {
    const minQuantity = b?.items?.[0]?.minQuantity ?? 1

    if (!uniqueMinQuantity.has(minQuantity)) {
      uniqueMinQuantity.add(minQuantity)

      return b
    }

    return {}
  })

  return uniqueBenefits?.filter((benefit) => Object.keys(benefit).length > 0)
}
