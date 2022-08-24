import { ServiceContext, UserInputError } from '@vtex/api'
import { Clients } from '../clients'

export async function getPromotion(ctx: ServiceContext<Clients>) {
  const {
    vtex: {
      route: {
        params: { promotion },
      },
    },
    clients: { apps },
  } = ctx

  const appSettings = await apps.getAppSettings(process.env.VTEX_APP_ID!)

  const apiKey = appSettings['X-VTEX-API-AppKey'] as string
  const apiToken = appSettings['X-VTEX-API-AppToken'] as string

  if (!apiKey || !apiToken) {
    throw new UserInputError('api settings are required')
  }

  if (!promotion) {
    throw new UserInputError('promotionId is required')
  }

  try {
    const response = await ctx.clients.promotion.getPromotion(
      promotion as string,
      apiKey,
      apiToken
    )
    ctx.status = 200
    ctx.set('Cache-Control', 'no-cache')
    ctx.body = JSON.stringify(response, null, 2)
  } catch {
    throw new UserInputError(`invalid promotionId: ${promotion}`)
  }
}
