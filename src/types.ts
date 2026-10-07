export type DietaryTag = 'Gluten-free' | 'Vegetarian' | 'Vegan' | 'Spicy'

export interface Food {
  id: string
  name: string
  description: string
  detail: string
  price: number
  image: string
  tags: DietaryTag[]
}

export interface CartLine {
  food: Food
  quantity: number
}
