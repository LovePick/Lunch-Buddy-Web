import { useMemo, useState } from 'react'
import {
  calculateCheckout,
  CheckoutValidationError,
} from './checkout'
import { CartScreen } from './components/CartScreen'
import { FoodDialog } from './components/FoodDialog'
import { MenuScreen, type MenuFilter } from './components/MenuScreen'
import { formatTHB } from './format'
import { menu } from './menu'
import type { CartLine, Food } from './types'

type AppPage = 'menu' | 'cart'
type Notice = { type: 'success' | 'error'; title: string; message: string }

export default function App() {
  const [page, setPage] = useState<AppPage>('menu')
  const [searchText, setSearchText] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<MenuFilter>('All')
  const [selectedFood, setSelectedFood] = useState<Food | null>(null)
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [couponCode, setCouponCode] = useState('')
  const [notice, setNotice] = useState<Notice | null>(null)

  const cartLines = useMemo<CartLine[]>(
    () =>
      menu.flatMap((food) => {
        const quantity = quantities[food.id] ?? 0
        return quantity > 0 ? [{ food, quantity }] : []
      }),
    [quantities],
  )

  const filteredFoods = useMemo(() => {
    const normalizedSearch = searchText.trim().toLocaleLowerCase()

    return menu.filter((food) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        food.name.toLocaleLowerCase().includes(normalizedSearch) ||
        food.description.toLocaleLowerCase().includes(normalizedSearch)
      const matchesFilter =
        selectedFilter === 'All' || food.tags.includes(selectedFilter)

      return matchesSearch && matchesFilter
    })
  }, [searchText, selectedFilter])

  const itemCount = Object.values(quantities).reduce(
    (total, quantity) => total + quantity,
    0,
  )
  const subtotal = cartLines.reduce(
    (total, line) => total + line.food.price * line.quantity,
    0,
  )

  function addFood(food: Food, quantity = 1) {
    setQuantities((current) => ({
      ...current,
      [food.id]: (current[food.id] ?? 0) + quantity,
    }))
  }

  function changeQuantity(foodId: string, nextQuantity: number) {
    setQuantities((current) => {
      const updated = { ...current }

      if (nextQuantity <= 0) {
        delete updated[foodId]
      } else {
        updated[foodId] = nextQuantity
      }

      return updated
    })
  }

  function removeFood(foodId: string) {
    changeQuantity(foodId, 0)
  }

  function addFromDialog(food: Food, quantity: number) {
    addFood(food, quantity)
    setSelectedFood(null)
  }

  function checkout() {
    try {
      const summary = calculateCheckout(cartLines, couponCode)
      setNotice({
        type: 'success',
        title: 'Order submitted!',
        message: `Your final payable amount is ${formatTHB(summary.finalAmount)}.`,
      })
    } catch (error) {
      const message =
        error instanceof CheckoutValidationError
          ? error.message
          : 'Something went wrong. Please try again.'

      setNotice({
        type: 'error',
        title: 'Unable to checkout',
        message,
      })
    }
  }

  function finishSuccessfulOrder() {
    if (notice?.type === 'success') {
      setQuantities({})
      setCouponCode('')
      setPage('menu')
    }
    setNotice(null)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <button
          className="brand-button"
          onClick={() => setPage('menu')}
          type="button"
          aria-label="Open menu"
        >
          <span className="brand-mark" aria-hidden="true">
            LB
          </span>
          <span>
            <strong>Lunch Buddy</strong>
            <small>What sounds good today?</small>
          </span>
        </button>

        <button
          className="cart-button"
          onClick={() => setPage('cart')}
          type="button"
          aria-label={`Open current order with ${itemCount} items`}
        >
          <span aria-hidden="true">🛍️</span>
          {itemCount > 0 && <strong>{itemCount}</strong>}
        </button>
      </header>

      {page === 'menu' ? (
        <MenuScreen
          foods={filteredFoods}
          searchText={searchText}
          selectedFilter={selectedFilter}
          quantities={quantities}
          onSearchChange={setSearchText}
          onFilterChange={setSelectedFilter}
          onFoodSelect={setSelectedFood}
          onAdd={addFood}
        />
      ) : (
        <CartScreen
          lines={cartLines}
          couponCode={couponCode}
          onBack={() => setPage('menu')}
          onCouponChange={setCouponCode}
          onQuantityChange={changeQuantity}
          onRemove={removeFood}
          onCheckout={checkout}
        />
      )}

      {page === 'menu' && itemCount > 0 && (
        <div className="floating-order-bar">
          <button
            className="primary-button order-summary-button"
            onClick={() => setPage('cart')}
            type="button"
          >
            <span>
              Order {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
            <span>{formatTHB(subtotal)}</span>
          </button>
        </div>
      )}

      {selectedFood && (
        <FoodDialog
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
          onAdd={addFromDialog}
        />
      )}

      {notice && (
        <div className="notice-backdrop" role="presentation">
          <section
            className={`notice-card notice-card--${notice.type}`}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="notice-title"
          >
            <span className="notice-icon" aria-hidden="true">
              {notice.type === 'success' ? '✓' : '!'}
            </span>
            <h2 id="notice-title">{notice.title}</h2>
            <p>{notice.message}</p>
            <button
              className="primary-button"
              onClick={finishSuccessfulOrder}
              type="button"
            >
              OK
            </button>
          </section>
        </div>
      )}
    </div>
  )
}
