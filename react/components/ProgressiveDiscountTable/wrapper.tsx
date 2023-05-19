/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedCurrency } from 'vtex.format-currency'
import { Collapsible, Modal } from 'vtex.styleguide'

import styles from './style.css'

const WrapperProgressiveDiscount = ({
  benefits,
  basePrice,
  measurementUnit,
  isModal,
  title,
}: WrapperProgressiveDiscountProps) => {
  const handles = useCssHandles(Object.keys(styles))
  const [isOpen, setOpen] = useState(false)

  const header = (
    <span className="c-muted-1 fw5">
      <FormattedMessage id="store/view-price-by-volume" />
    </span>
  )

  const table = (
    <ul className="list pl0 c-muted-1">
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
                {+benefits[index + 1]?.minQuantity - 1}
              </>
            ) : (
              `${benefit?.minQuantity}+`
            )}
          </div>
          <div className={`${handles.currency} pa2`}>
            <FormattedCurrency
              value={+basePrice * (1 - +benefit?.discount / 100)}
            />{' '}
            / {measurementUnit}
          </div>
        </li>
      ))}
    </ul>
  )

  return (
    <div
      className={`${handles.container} ${
        isModal ? handles.modalContainer : ''
      }`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      {isModal ? (
        <>
          <span onClick={() => setOpen((prevOpen) => !prevOpen)}>{header}</span>
          <Modal
            centered
            title={title}
            isOpen={isOpen}
            onClose={() => setOpen((prevOpen) => !prevOpen)}
          >
            {table}
          </Modal>
        </>
      ) : (
        <Collapsible
          align="right"
          caretColor="base"
          header={header}
          onClick={() => setOpen((prevOpen) => !prevOpen)}
          isOpen={isOpen}
        >
          {table}
        </Collapsible>
      )}
    </div>
  )
}

export default WrapperProgressiveDiscount
