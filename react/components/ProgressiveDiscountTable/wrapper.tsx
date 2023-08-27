import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedCurrency } from 'vtex.format-currency'
import { Collapsible, Modal } from 'vtex.styleguide'

import styles from './style.css'

interface Props {
  benefits: Array<{
    minQuantity: number
    discount: number
  }>
  basePrice: number
  measurementUnit: string
  isModal?: boolean
  title?: string
}

const WrapperProgressiveDiscount = ({
  benefits,
  basePrice,
  measurementUnit,
  isModal,
  title,
}: Props) => {
  const handles = useCssHandles([
    'title',
    'modalContainer',
    ...Object.keys(styles),
  ])

  const [isOpen, setOpen] = useState(false)

  const header = (
    <span className={`c-muted-1 fw5 ${handles.title}`}>
      <FormattedMessage id="store/view-price-by-volume" />
    </span>
  )

  const firstQuantity = benefits[0]?.minQuantity

  const renderPrice = (price: number, discount: number, unit?: string) => {
    return (
      <span className={`${handles.currency} pa2`}>
        <FormattedCurrency value={price * (1 - discount / 100)} />
        {!!unit && ` / ${unit}`}
      </span>
    )
  }

  const table = (
    <ul className="list pl0 c-muted-1">
      {firstQuantity > 1 && (
        <li className="bb mt6 pb6 b--muted-3 flex justify-between items-center">
          <div>
            1 <span className={handles.quantityArrow}>&#10230;</span>{' '}
            {firstQuantity - 1}
          </div>
          {renderPrice(basePrice, 0, measurementUnit)}
        </li>
      )}
      {benefits.map((benefit, index) => (
        <li
          key={`benefit-${index}`}
          className={`${
            index !== benefits.length - 1 ? 'bb' : ''
          } mt6 pb6 b--muted-3 flex justify-between items-center`}
        >
          <div>
            {index < benefits.length - 1 ? (
              <>
                {benefit?.minQuantity}{' '}
                <span className={handles.quantityArrow}>&#10230;</span>{' '}
                {benefits[index + 1]?.minQuantity - 1}
              </>
            ) : (
              `${benefit?.minQuantity}+`
            )}
          </div>
          {renderPrice(basePrice, benefit?.discount, measurementUnit)}
        </li>
      ))}
    </ul>
  )

  const preventDefault = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const toggle = () => setOpen((prevOpen) => !prevOpen)

  return (
    <div
      className={`${handles.container} ${
        isModal ? handles.modalContainer : ''
      }`}
      role="button"
      tabIndex={-1}
      onKeyDown={preventDefault}
      onClick={preventDefault}
    >
      {isModal ? (
        <>
          <span role="button" tabIndex={-1} onKeyDown={toggle} onClick={toggle}>
            {header}
          </span>
          <Modal centered title={title} isOpen={isOpen} onClose={toggle}>
            {table}
          </Modal>
        </>
      ) : (
        <Collapsible
          align="right"
          caretColor="base"
          header={header}
          onClick={toggle}
          isOpen={isOpen}
        >
          {table}
        </Collapsible>
      )}
    </div>
  )
}

export default WrapperProgressiveDiscount
