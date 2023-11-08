import type { Cached, ClientsConfig } from '@vtex/api'
import { LRUCache, Service, method } from '@vtex/api'

import { Clients } from './clients'
import { getFixedPrices as getFixedPricesMiddleware } from './handlers/getFixedPrices'
import { getPromotions } from './handlers/getPromotions'
import { getFixedPrices } from './resolvers/getFixedPrices'

const TIMEOUT_MS = 3000
const CONCURRENCY = 10
const memoryCache = new LRUCache<string, Cached>({ max: 5000 })

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      exponentialTimeoutCoefficient: 2,
      exponentialBackoffCoefficient: 2,
      initialBackoffDelay: 100,
      retries: 10,
      timeout: TIMEOUT_MS,
      concurrency: CONCURRENCY,
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
      GET: getFixedPricesMiddleware,
    }),
  },
  graphql: {
    resolvers: {
      Query: {
        getFixedPrices,
      },
    },
  },
})
