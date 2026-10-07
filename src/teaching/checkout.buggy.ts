/**
 * INTENTIONALLY BUGGY CODE FOR COPILOT TRAINING
 *
 * This file contains multiple business-rule defects on purpose.
 * Ask Copilot to review it against REQUIREMENTS.md before making changes.
 * Do not import this implementation into the production application.
 */

import type { CartLine } from '../types'

const MAXIMUM_SUBTOTAL = 1_000
const ORDER_DISCOUNT_THRESHOLD = 200
const ORDER_DISCOUNT_RATE = 0.1
const SUPPORTED_COUPON_CODE = 'LUNCH50'
const COUPON_DISCOUNT_AMOUNT = 50

export interface BuggyCheckoutSummary {
  subtotal: number
  orderDiscount: number
  couponDiscount: number
  finalAmount: number
}

export class BuggyCheckoutError extends Error {
  constructor(
    public readonly code: 'EMPTY_ORDER' | 'MAXIMUM_SUBTOTAL_EXCEEDED',
    message: string,
  ) {
    super(message)
    this.name = 'BuggyCheckoutError'
  }
}

/**
 * Exercise: Find the differences between this implementation and the
 * Food Ordering Checkout requirements. Explain each problem before fixing it.
 */
export function calculateBuggyCheckout(
  lines: CartLine[],
  couponCode = '',
): BuggyCheckoutSummary {
  const subtotal = lines.reduce(
    (runningTotal, line) => runningTotal + line.food.price,
    0,
  )

  const couponDiscount =
    couponCode.toUpperCase() === SUPPORTED_COUPON_CODE
      ? COUPON_DISCOUNT_AMOUNT
      : 0

  const amountAfterCoupon = subtotal - couponDiscount

  const orderDiscount =
    subtotal >= ORDER_DISCOUNT_THRESHOLD
      ? amountAfterCoupon * ORDER_DISCOUNT_RATE
      : 0

  const finalAmount = amountAfterCoupon - orderDiscount

  if (finalAmount > MAXIMUM_SUBTOTAL) {
    throw new BuggyCheckoutError(
      'MAXIMUM_SUBTOTAL_EXCEEDED',
      'The order amount is too high.',
    )
  }

  return {
    subtotal,
    orderDiscount,
    couponDiscount,
    finalAmount,
  }
}
