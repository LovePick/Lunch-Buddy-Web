import type { Food } from './types'

export const menu: Food[] = [
  {
    id: 'pad-kra-pao',
    name: 'Pad Kra Pao',
    description: 'Holy basil pork, jasmine rice and a crispy fried egg',
    detail:
      'A Thai comfort-food classic with fragrant holy basil, savoury minced pork, chilli, garlic, steamed jasmine rice and a golden fried egg.',
    price: 80,
    image: '/images/pad-kra-pao.png',
    tags: ['Gluten-free', 'Spicy'],
  },
  {
    id: 'pineapple-fried-rice',
    name: 'Pineapple Fried Rice',
    description: 'Shrimp, pineapple, cashews, egg and scallions',
    detail:
      'Wok-tossed jasmine rice with juicy shrimp, sweet pineapple, toasted cashews, soft egg and fresh scallions.',
    price: 120,
    image: '/images/pineapple-fried-rice.png',
    tags: ['Gluten-free'],
  },
  {
    id: 'green-curry',
    name: 'Green Curry',
    description: 'Chicken, Thai eggplant, coconut milk and sweet basil',
    detail:
      'Creamy green curry simmered with tender chicken, Thai eggplant, coconut milk, red chilli and aromatic sweet basil.',
    price: 140,
    image: '/images/green-curry.png',
    tags: ['Gluten-free', 'Spicy'],
  },
  {
    id: 'tom-yum',
    name: 'Tom Yum Goong',
    description: 'Hot and sour prawn soup with lemongrass and lime',
    detail:
      'A bright, hot-and-sour broth with prawns, mushrooms, lemongrass, makrut lime leaves, chilli and fresh lime.',
    price: 160,
    image: '/images/tom-yum.png',
    tags: ['Gluten-free', 'Spicy'],
  },
  {
    id: 'veggie-bowl',
    name: 'Garden Veggie Bowl',
    description: 'Seasonal vegetables, tofu, herbs and jasmine rice',
    detail:
      'A colourful bowl of wok-seared seasonal vegetables, golden tofu, fresh herbs and steamed jasmine rice.',
    price: 110,
    image: '/images/pineapple-fried-rice.png',
    tags: ['Gluten-free', 'Vegetarian', 'Vegan'],
  },
]
