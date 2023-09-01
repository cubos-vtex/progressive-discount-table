import { IOClients } from '@vtex/api'

import FixedPricesClient from './fixedPricesClient'
import PromotionClient from './promotionClient'

export class Clients extends IOClients {
  public get promotion() {
    return this.getOrSet('promotion', PromotionClient)
  }

  public get fixedPrices() {
    return this.getOrSet('fixedPrices', FixedPricesClient)
  }
}
