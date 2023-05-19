/* eslint-disable @typescript-eslint/no-explicit-any */
import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

const FIVE_SECONDS_MS = 5 * 1000

export default class CollectionClient extends JanusClient {
  private baseUrl = '/api/rnb/pvt'
  private apiKey = ''
  private apiToken = ''

  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...options?.headers,
        VtexIdClientAutCookie: context.authToken,
      },
      timeout: FIVE_SECONDS_MS,
    })
  }

  public setApiSettings(apiKey: string, apiToken: string) {
    this.apiKey = apiKey
    this.apiToken = apiToken
  }

  public getPromotions(promotion?: string) {
    return this.http.get(
      `${this.baseUrl}/${
        promotion
          ? `calculatorconfiguration/${promotion}`
          : 'benefits/calculatorconfiguration'
      }`,
      {
        headers: {
          ...this.options?.headers,
          'X-VTEX-API-AppKey': this.apiKey,
          'X-VTEX-API-AppToken': this.apiToken,
        },
      }
    )
  }

  public async getProgressivePromotions(skuId?: string) {
    const allPromotions = await this.getPromotions()

    const allProgressiveAndActivePromotions: Array<Record<string, any>> =
      allPromotions.items.filter(
        (promotion: Record<string, any>) =>
          promotion.type === 'progressive' && promotion.status === 'active'
      )

    const completeProgressiveAndActivePromotions = await Promise.all(
      allProgressiveAndActivePromotions.map(async (promotion) => {
        const completePromotion = await this.getPromotions(
          promotion.idCalculatorConfiguration
        )

        return { ...promotion, ...completePromotion }
      })
    )

    if (skuId) {
      return completeProgressiveAndActivePromotions.find(
        (promotion) =>
          promotion.listSku1BuyTogether.filter(
            (sku: Record<string, any>) => sku.id === skuId
          )?.length
      )
    }

    return completeProgressiveAndActivePromotions
  }
}
