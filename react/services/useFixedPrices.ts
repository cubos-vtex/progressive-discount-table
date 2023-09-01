import { useQuery } from '@tanstack/react-query'

import type { ApiResponse } from '.'
import { apiRequestFactory } from '.'

type FixedPricesResponse = ApiResponse &
  Array<{
    tradePolicyId: string
    value: number
    minQuantity?: number
  }>

export const useFixedPrices = (
  skuId?: string,
  priceTables?: string[],
  tradePolicy?: string
) => {
  return useQuery({
    queryKey: ['fixedPrices', skuId, priceTables, tradePolicy],
    queryFn: async () =>
      apiRequestFactory<FixedPricesResponse>(
        `/_v/fixed-prices/${skuId}`
      )().then((fixedPrices) => {
        const fixedPricesByPriceTables = fixedPrices.filter((fixedPrice) =>
          priceTables?.includes(fixedPrice.tradePolicyId)
        )

        if (fixedPricesByPriceTables?.length) {
          return fixedPricesByPriceTables
        }

        return fixedPrices.filter(
          (fixedPrice) => fixedPrice.tradePolicyId === tradePolicy
        )
      }),
    enabled: !!skuId && !!tradePolicy,
  })
}
