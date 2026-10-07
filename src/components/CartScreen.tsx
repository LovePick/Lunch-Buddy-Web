import {
  calculateCheckout,
  calculateCouponDiscount,
  calculateOrderDiscount,
  calculateSubtotal,
} from '../checkout'
import { formatTHB } from '../format'
import type { CartLine } from '../types'

interface CartScreenProps {
  lines: CartLine[]
  couponCode: string
  onBack: () => void
  onCouponChange: (value: string) => void
  onQuantityChange: (foodId: string, quantity: number) => void
  onRemove: (foodId: string) => void
  onCheckout: () => void
}

export function CartScreen({
  lines,
  couponCode,
  onBack,
  onCouponChange,
  onQuantityChange,
  onRemove,
  onCheckout,
}: CartScreenProps) {
  const subtotal = calculateSubtotal(lines)
  const orderDiscount = calculateOrderDiscount(subtotal)
  const couponDiscount = calculateCouponDiscount(couponCode)
  const previewFinalAmount = Math.max(
    0,
    subtotal - orderDiscount - couponDiscount,
  )

  // Calling the main calculator here tells us whether this order is valid.
  let validationMessage = ''
  try {
    calculateCheckout(lines, couponCode)
  } catch (error) {
    if (error instanceof Error) validationMessage = error.message
  }

  return (
    <main className="cart-screen">
      <div className="cart-title-row">
        <button
          className="back-button"
          onClick={onBack}
          type="button"
          aria-label="Back to menu"
        >
          ‹
        </button>
        <div>
          <p className="eyebrow">Review and confirm</p>
          <h1>Your Order</h1>
        </div>
      </div>

      {lines.length === 0 ? (
        <section className="empty-state empty-state--cart">
          <span aria-hidden="true">🛍️</span>
          <h2>Your order is empty</h2>
          <p>Add at least one dish before checking out.</p>
          <button className="text-button" onClick={onBack} type="button">
            Browse the menu
          </button>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="cart-items" aria-label="Items in your order">
            {lines.map((line) => (
              <article className="cart-item" key={line.food.id}>
                <img src={line.food.image} alt={line.food.name} />
                <div className="cart-item__body">
                  <div className="cart-item__title-row">
                    <h2>{line.food.name}</h2>
                    <button
                      className="remove-button"
                      onClick={() => onRemove(line.food.id)}
                      type="button"
                      aria-label={`Remove ${line.food.name}`}
                    >
                      ×
                    </button>
                  </div>
                  <div className="cart-item__footer">
                    <div className="quantity-control quantity-control--small">
                      <button
                        onClick={() =>
                          onQuantityChange(line.food.id, line.quantity - 1)
                        }
                        type="button"
                        aria-label={`Decrease ${line.food.name}`}
                      >
                        −
                      </button>
                      <strong>{line.quantity}</strong>
                      <button
                        onClick={() =>
                          onQuantityChange(line.food.id, line.quantity + 1)
                        }
                        type="button"
                        aria-label={`Increase ${line.food.name}`}
                      >
                        +
                      </button>
                    </div>
                    <strong className="price-accent">
                      {formatTHB(line.food.price * line.quantity)}
                    </strong>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className="checkout-panel">
            <section className="coupon-card">
              <label htmlFor="coupon">Have a coupon?</label>
              <div className="coupon-input">
                <span aria-hidden="true">🎟️</span>
                <input
                  id="coupon"
                  value={couponCode}
                  onChange={(event) =>
                    onCouponChange(event.target.value.toUpperCase())
                  }
                  placeholder="Enter coupon code"
                />
                {couponCode.trim() === 'LUNCH50' && (
                  <span className="coupon-check" aria-label="Coupon applied">
                    ✓
                  </span>
                )}
              </div>
              <small>Try LUNCH50 for ฿50 off</small>
            </section>

            <section className="summary-card" aria-label="Order summary">
              <SummaryRow label="Subtotal" value={subtotal} />
              {orderDiscount > 0 && (
                <SummaryRow
                  label="Order discount (10%)"
                  value={-orderDiscount}
                  isDiscount
                />
              )}
              {couponDiscount > 0 && (
                <SummaryRow
                  label="LUNCH50"
                  value={-couponDiscount}
                  isDiscount
                />
              )}
              <hr />
              <div className="summary-total">
                <strong>Total</strong>
                <strong>{formatTHB(previewFinalAmount)}</strong>
              </div>
            </section>

            {validationMessage.includes('1,000') && (
              <p className="inline-error">⚠ {validationMessage}</p>
            )}
          </aside>
        </div>
      )}

      <div className="checkout-action">
        <button className="primary-button" onClick={onCheckout} type="button">
          Checkout
        </button>
      </div>
    </main>
  )
}

function SummaryRow({
  label,
  value,
  isDiscount = false,
}: {
  label: string
  value: number
  isDiscount?: boolean
}) {
  return (
    <div className="summary-row">
      <span>{label}</span>
      <span className={isDiscount ? 'discount-text' : undefined}>
        {formatTHB(value)}
      </span>
    </div>
  )
}
