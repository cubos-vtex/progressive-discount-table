import type { ClientsConfig } from '@vtex/api'
import { LRUCache, method, Service } from '@vtex/api'

import { Clients } from './clients'
import { getFixedPrices } from './handlers/getFixedPrices'
import { getPromotions } from './handlers/getPromotions'

const TIMEOUT_MS = 10000
const memoryCache = new LRUCache<string, never>({ max: 5000 })

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
      memoryCache,
    },
  },
}

export default new Service({
  clients,
  routes: {
    promotion: method({
      GET: getPromotions,
    }),
    progressivePromotions: method({
      GET: getPromotions,
    }),
    progressivePromotionsBySku: method({
      GET: getPromotions,
    }),
    fixedPricesBySku: method({
      GET: getFixedPrices,
    }),
  },
})
