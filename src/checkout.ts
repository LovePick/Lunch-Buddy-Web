import type { CartLine } from './types'

// Business rule constants are named so learners can map code back to requirements.
export const MAXIMUM_SUBTOTAL = 1_000
export const ORDER_DISCOUNT_THRESHOLD = 200
export const ORDER_DISCOUNT_RATE = 0.1
export const SUPPORTED_COUPON_CODE = 'LUNCH50'
export const COUPON_DISCOUNT_AMOUNT = 50

export interface CheckoutSummary {
  subtotal: number
  orderDiscount: number
  couponDiscount: number
  finalAmount: number
}

export type CheckoutErrorCode = 'EMPTY_ORDER' | 'MAXIMUM_SUBTOTAL_EXCEEDED'

/** Error returned when an order violates a checkout business rule. */
export class CheckoutValidationError extends Error {
  constructor(public readonly code: CheckoutErrorCode, message: string) {
    super(message)
    this.name = 'CheckoutValidationError'
  }
}

/** Round a monetary amount to two decimal places to avoid floating-point noise. */
function roundCurrency(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100
}

/** Calculate subtotal by adding ItemPrice × Quantity for every cart line. */
export function calculateSubtotal(lines: CartLine[]): number {
  const subtotal = lines.reduce(
    (runningTotal, line) => runningTotal + line.food.price * line.quantity,
    0,
  )

  return roundCurrency(subtotal)
}

/** Apply a 10% discount only when subtotal is greater than 200 THB. */
export function calculateOrderDiscount(subtotal: number): number {
  if (subtotal <= ORDER_DISCOUNT_THRESHOLD) return 0
  return roundCurrency(subtotal * ORDER_DISCOUNT_RATE)
}

/** Apply the fixed 50 THB discount when the coupon is exactly LUNCH50. */
export function calculateCouponDiscount(couponCode: string): number {
  return couponCode.trim() === SUPPORTED_COUPON_CODE
    ? COUPON_DISCOUNT_AMOUNT
    : 0
}

/**
 * Validate an order and calculate its final payable amount.
 *
 * Calculation order:
 * 1. Validate that the order contains at least one item.
 * 2. Calculate subtotal before discounts.
 * 3. Reject subtotal greater than 1,000 THB.
 * 4. Apply the 10% order discount.
 * 5. Apply the fixed coupon discount.
 * 6. Clamp the final amount so it cannot be negative.
 */
export function calculateCheckout(
  lines: CartLine[],
  couponCode = '',
): CheckoutSummary {
  if (lines.length === 0) {
    throw new CheckoutValidationError(
      'EMPTY_ORDER',
      'Please add at least one item before checkout.',
    )
  }

  const subtotal = calculateSubtotal(lines)

  if (subtotal > MAXIMUM_SUBTOTAL) {
    throw new CheckoutValidationError(
      'MAXIMUM_SUBTOTAL_EXCEEDED',
      'The subtotal cannot exceed ฿1,000. Please remove an item and try again.',
    )
  }

  // The order discount is calculated before the coupon discount.
  const orderDiscount = calculateOrderDiscount(subtotal)
  const couponDiscount = calculateCouponDiscount(couponCode)
  const amountAfterDiscounts = subtotal - orderDiscount - couponDiscount

  return {
    subtotal,
    orderDiscount,
    couponDiscount,
    finalAmount: Math.max(0, roundCurrency(amountAfterDiscounts)),
  }
}
