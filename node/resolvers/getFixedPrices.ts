import type { ServiceContext } from '@vtex/api'
import type { QueryGetFixedPricesArgs } from 'ssesandbox04.progressive-discount-table'

import type { Clients } from '../clients'

export const getFixedPrices = async (
  _: unknown,
  { skuId }: QueryGetFixedPricesArgs,
  { clients: { fixedPrices } }: ServiceContext<Clients>
) => fixedPrices.get(skuId).catch(() => null)
