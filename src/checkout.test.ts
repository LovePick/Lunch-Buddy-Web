import { describe, expect, it } from 'vitest'
import { calculateCheckout, CheckoutValidationError } from './checkout'
import type { CartLine, Food } from './types'

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

describe('Food Ordering Checkout', () => {
  it('rejects an empty order', () => {
    expect(() => calculateCheckout([])).toThrowError(
      expect.objectContaining<Partial<CheckoutValidationError>>({
        code: 'EMPTY_ORDER',
      }),
    )
  })

  it('does not apply 10% discount when subtotal is exactly 200 THB', () => {
    const result = calculateCheckout([makeLine(200)])
    expect(result.orderDiscount).toBe(0)
    expect(result.finalAmount).toBe(200)
  })

  it('applies 10% discount when subtotal is 201 THB', () => {
    const result = calculateCheckout([makeLine(201)])
    expect(result.orderDiscount).toBe(20.1)
    expect(result.finalAmount).toBe(180.9)
  })

  it('applies LUNCH50 after the 10% order discount', () => {
    const result = calculateCheckout([makeLine(300)], 'LUNCH50')
    expect(result.orderDiscount).toBe(30)
    expect(result.couponDiscount).toBe(50)
    expect(result.finalAmount).toBe(220)
  })

  it('rejects an order when subtotal is greater than 1,000 THB', () => {
    expect(() => calculateCheckout([makeLine(1_001)])).toThrowError(
      expect.objectContaining<Partial<CheckoutValidationError>>({
        code: 'MAXIMUM_SUBTOTAL_EXCEEDED',
      }),
    )
  })

  it('never returns a negative final amount', () => {
    const result = calculateCheckout([makeLine(20)], 'LUNCH50')
    expect(result.finalAmount).toBe(0)
  })
})
