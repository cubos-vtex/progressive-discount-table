import type { IOContext, InstanceOptions } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import type { FixedPrice, Maybe } from 'ssesandbox04.progressive-discount-table'

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
    return this.http.get<Maybe<FixedPrice[]>>(`/${skuId}/fixed`)
  }
}
