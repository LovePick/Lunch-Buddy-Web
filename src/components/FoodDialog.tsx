import { useEffect, useState } from 'react'
import { formatTHB, tagIcon } from '../format'
import type { Food } from '../types'

interface FoodDialogProps {
  food: Food
  onClose: () => void
  onAdd: (food: Food, quantity: number) => void
}

export function FoodDialog({ food, onClose, onAdd }: FoodDialogProps) {
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  return (
    <div className="dialog-backdrop" onMouseDown={onClose}>
      <section
        className="food-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="food-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="food-dialog__hero">
          <img src={food.image} alt={food.name} />
          <button
            className="dialog-close"
            onClick={onClose}
            type="button"
            aria-label="Close food details"
          >
            ×
          </button>
        </div>

        <div className="food-dialog__content">
          <div className="food-dialog__title-row">
            <h2 id="food-dialog-title">{food.name}</h2>
            <strong>{formatTHB(food.price)}</strong>
          </div>
          <p>{food.detail}</p>
          <div className="tag-list">
            {food.tags.map((tag) => (
              <span key={tag}>
                {tagIcon(tag)} {tag}
              </span>
            ))}
          </div>
        </div>

        <footer className="food-dialog__footer">
          <div className="quantity-control" aria-label="Quantity">
            <button
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              type="button"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <strong>{quantity}</strong>
            <button
              onClick={() => setQuantity((current) => current + 1)}
              type="button"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            className="primary-button dialog-add-button"
            onClick={() => onAdd(food, quantity)}
            type="button"
          >
            <span>Add to Order</span>
            <span>{formatTHB(food.price * quantity)}</span>
          </button>
        </footer>
      </section>
    </div>
  )
}
