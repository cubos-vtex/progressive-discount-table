import { IOClients } from '@vtex/api'

import PromotionClient from './promotionClient'

export class Clients extends IOClients {
  public get promotion() {
    return this.getOrSet('promotion', PromotionClient)
  }
}
