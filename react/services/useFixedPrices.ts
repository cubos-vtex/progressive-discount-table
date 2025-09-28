import { useQuery } from 'react-apollo'
import type {
  FixedPrice,
  Maybe,
  Query,
  QueryGetFixedPricesBySkuIdsArgs,
} from 'ssesandbox04.progressive-discount-table'

import GET_FIXED_PRICES from '../graphql/getFixedPricesBySkuIds.graphql'

type QueryGetFixedPrices = Pick<Query, 'getFixedPricesBySkuIds'>

export const useFixedPrices = (
  skuIds?: Array<string | null | undefined>,
  priceTables?: string[],
  tradePolicy?: string
) => {
  const { data, loading, error } = useQuery<
    QueryGetFixedPrices,
    QueryGetFixedPricesBySkuIdsArgs
  >(GET_FIXED_PRICES, {
    skip: !skuIds || !tradePolicy,
    variables: { skuIds: skuIds as string[] },
  })

  const fixedPricesByPriceTables = data?.getFixedPricesBySkuIds?.filter(
    (fixedPrice: Maybe<FixedPrice>) =>
      !!fixedPrice && priceTables?.includes(fixedPrice.tradePolicyId)
  )

  if (fixedPricesByPriceTables?.length) {
    return { data: fixedPricesByPriceTables, loading, error }
  }

  return {
    data: data?.getFixedPricesBySkuIds?.filter(
      (fixedPrice: Maybe<FixedPrice>) =>
        fixedPrice?.tradePolicyId === tradePolicy
    ),
    loading,
    error,
  }
}
