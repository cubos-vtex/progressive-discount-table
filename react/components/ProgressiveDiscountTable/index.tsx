import { useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedCurrency } from 'vtex.format-currency'
import { useProduct } from 'vtex.product-context'
import { Collapsible } from 'vtex.styleguide'
import styles from './style.css'

const ProgressiveDiscountTable = () => {
  const productContextValue = useProduct()
  const {
    product: { benefits },
    selectedItem: { measurementUnit },
  } = productContextValue

  if (!benefits?.length) {
    return null
  }

  const handles = useCssHandles(Object.keys(styles))
  const [isOpen, setOpen] = useState(false)
  const minQuantities = benefits.map((benefit, index) =>
    index < benefits.length - 1 ? (
      <>
        {benefit?.items[0]?.minQuantity} &#10230;{' '}
        {+benefits[index + 1]?.items[0]?.minQuantity - 1}
      </>
    ) : (
      `${benefit?.items[0]?.minQuantity}+`
    )
  )

  return (
    <div className={`${handles.container}`}>
      <Collapsible
        align="right"
        caretColor="base"
        header={<span className="c-muted-1 fw5">Ver preço por volume</span>}
        onClick={() => setOpen((prevOpen) => !prevOpen)}
        isOpen={isOpen}
      >
        <ul className="list pl0 c-muted-1">
          {benefits.map((benefit, index) => (
            <li
              className={`${
                index !== benefits.length - 1 ? 'bb' : ''
              } mt6 pb6 b--muted-3 flex justify-between`}
            >
              <div>{minQuantities[index]}</div>
              <div className={`${handles.currency} pa2`}>
                <FormattedCurrency
                  value={
                    +productContextValue?.selectedItem?.sellers[0]
                      ?.commertialOffer?.Price *
                    (1 - +benefit?.items[0]?.discount / 100)
                  }
                />{' '}
                / {measurementUnit}
              </div>
            </li>
          ))}
        </ul>
      </Collapsible>
    </div>
  )
}

export default ProgressiveDiscountTable
