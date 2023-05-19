import type { ServiceContext } from '@vtex/api'
import { UserInputError } from '@vtex/api'

import type { Clients } from '../clients'

export async function getPromotions(ctx: ServiceContext<Clients>) {
  const {
    vtex: {
      route: {
        params: { promotion, skuId },
      },
    },
    clients: { apps, promotion: promotionCLient },
  } = ctx

  const appSettings = await apps.getAppSettings(process.env.VTEX_APP_ID ?? '')

  const apiKey = appSettings['X-VTEX-API-AppKey'] as string
  const apiToken = appSettings['X-VTEX-API-AppToken'] as string

  if (!apiKey || !apiToken) {
    throw new UserInputError('api settings are required')
  }

  try {
    promotionCLient.setApiSettings(apiKey, apiToken)
    const response = promotion
      ? await promotionCLient.getPromotions(promotion as string)
      : await promotionCLient.getProgressivePromotions(skuId as string)

    ctx.status = 200
    ctx.set('Cache-Control', 'no-cache')
    ctx.body = JSON.stringify(response, null, 2)
  } catch (e) {
    throw new UserInputError(`invalid promotionId: ${promotion}`)
  }
}
