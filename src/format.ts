import type { DietaryTag } from './types'

const thbFormatter = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function formatTHB(amount: number): string {
  return thbFormatter.format(amount)
}

export function tagIcon(tag: DietaryTag): string {
  const icons: Record<DietaryTag, string> = {
    'Gluten-free': '🌾',
    Vegetarian: '🥕',
    Vegan: '🌿',
    Spicy: '🌶️',
  }

  return icons[tag]
}
