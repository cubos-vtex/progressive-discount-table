import type { ServiceContext } from '@vtex/api'

import type { Clients } from '../clients'

export async function getFixedPrices(ctx: ServiceContext<Clients>) {
  const {
    vtex: {
      route: {
        params: { skuId },
      },
    },
    clients: { fixedPrices },
  } = ctx

  ctx.body = await fixedPrices.get(skuId as string)
  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')
}
