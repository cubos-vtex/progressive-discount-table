export {}

declare global {
  export type Benefit = {
    minQuantity: number
    discount: number
  }

  export type WrapperProgressiveDiscountProps = {
    benefits: Benefit[]
    basePrice: number
    measurementUnit: string
    isModal?: boolean
    title?: string
  }
}
