/**
 * These tests describe the correct behaviour from the requirements.
 * They are expected to fail while checkout.buggy.ts still contains defects.
 *
 * Run only this exercise with: npm run test:buggy
 */

import { describe, expect, it } from 'vitest'
import {
  BuggyCheckoutError,
  calculateBuggyCheckout,
} from './checkout.buggy'
import type { CartLine, Food } from '../types'

function makeLine(price: number, quantity = 1): CartLine {
  const food: Food = {
    id: `test-${price}`,
    name: 'Test Food',
    description: '',
    detail: '',
    price,
    image: '',
    tags: [],
  }

  return { food, quantity }
}

describe('Bug hunt: Food Ordering Checkout', () => {
  it('rejects an empty order', () => {
    expect(() => calculateBuggyCheckout([])).toThrowError(
      expect.objectContaining<Partial<BuggyCheckoutError>>({
        code: 'EMPTY_ORDER',
      }),
    )
  })

  it('calculates ItemPrice × Quantity', () => {
    const result = calculateBuggyCheckout([makeLine(80, 2)])
    expect(result.subtotal).toBe(160)
  })

  it('does not apply 10% discount when subtotal is exactly 200 THB', () => {
    const result = calculateBuggyCheckout([makeLine(200)])
    expect(result.orderDiscount).toBe(0)
    expect(result.finalAmount).toBe(200)
  })

  it('applies 10% discount when subtotal is 201 THB', () => {
    const result = calculateBuggyCheckout([makeLine(201)])
    expect(result.orderDiscount).toBe(20.1)
    expect(result.finalAmount).toBe(180.9)
  })

  it('applies LUNCH50 after the 10% order discount', () => {
    const result = calculateBuggyCheckout([makeLine(300)], 'LUNCH50')
    expect(result.orderDiscount).toBe(30)
    expect(result.couponDiscount).toBe(50)
    expect(result.finalAmount).toBe(220)
  })

  it('rejects subtotal greater than 1,000 THB before discounts', () => {
    expect(() => calculateBuggyCheckout([makeLine(1_001)])).toThrowError(
      expect.objectContaining<Partial<BuggyCheckoutError>>({
        code: 'MAXIMUM_SUBTOTAL_EXCEEDED',
      }),
    )
  })

  it('never returns a negative final amount', () => {
    const result = calculateBuggyCheckout([makeLine(20)], 'LUNCH50')
    expect(result.finalAmount).toBe(0)
  })
})
