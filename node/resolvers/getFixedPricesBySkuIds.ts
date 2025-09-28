import type { ServiceContext } from '@vtex/api'
import type { QueryGetFixedPricesBySkuIdsArgs } from 'ssesandbox04.progressive-discount-table'

import type { Clients } from '../clients'

export const getFixedPricesBySkuIds = async (
  _: unknown,
  { skuIds }: QueryGetFixedPricesBySkuIdsArgs,
  { clients: { fixedPrices } }: ServiceContext<Clients>
) => {
  const allFixedPrices = await Promise.all(
    skuIds.map((skuId) => fixedPrices.get(skuId).catch(() => null))
  )

  return allFixedPrices.flat()
}
