import { ClientsConfig, LRUCache, method, Service } from '@vtex/api'
import { Clients } from './clients'
import { getPromotions } from './handlers/getPromotions'

const TIMEOUT_MS = 800
const memoryCache = new LRUCache<string, never>({ max: 5000 })

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
    },
    status: {
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
  },
})
