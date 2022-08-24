import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

const FIVE_SECONDS_MS = 5 * 1000

export default class CollectionClient extends JanusClient {
  private baseUrl = '/api/rnb/pvt/calculatorconfiguration'

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

  public getPromotion(promotion: string, apiKey: string, apiToken: string) {
    return this.http.get(`${this.baseUrl}/${promotion}`, {
      headers: {
        ...this.options?.headers,
        'X-VTEX-API-AppKey': apiKey,
        'X-VTEX-API-AppToken': apiToken,
      },
    })
  }
}
