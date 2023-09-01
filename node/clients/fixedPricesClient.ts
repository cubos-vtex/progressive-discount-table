import type { IOContext, InstanceOptions } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export default class FixedPricesClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`https://api.vtex.com/${context.account}/pricing/prices`, context, {
      ...options,
      headers: {
        ...options?.headers,
        VtexIdClientAutCookie: context.authToken,
      },
    })
  }

  public get(skuId: string) {
    return this.http.get(`/${skuId}/fixed`)
  }
}
