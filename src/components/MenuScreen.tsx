import type { DietaryTag, Food } from '../types'
import { formatTHB, tagIcon } from '../format'

export type MenuFilter = 'All' | DietaryTag

interface MenuScreenProps {
  foods: Food[]
  searchText: string
  selectedFilter: MenuFilter
  quantities: Record<string, number>
  onSearchChange: (value: string) => void
  onFilterChange: (filter: MenuFilter) => void
  onFoodSelect: (food: Food) => void
  onAdd: (food: Food) => void
}

const filters: MenuFilter[] = [
  'All',
  'Gluten-free',
  'Vegetarian',
  'Vegan',
  'Spicy',
]

export function MenuScreen({
  foods,
  searchText,
  selectedFilter,
  quantities,
  onSearchChange,
  onFilterChange,
  onFoodSelect,
  onAdd,
}: MenuScreenProps) {
  return (
    <main className="menu-screen">
      <label className="search-box">
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="What are you looking for?"
          aria-label="Search menu"
        />
      </label>

      <div className="filter-row" aria-label="Menu filters">
        {filters.map((filter) => (
          <button
            className={`filter-chip ${selectedFilter === filter ? 'is-active' : ''}`}
            key={filter}
            onClick={() => onFilterChange(filter)}
            type="button"
          >
            <span aria-hidden="true">
              {filter === 'All' ? '✦' : tagIcon(filter)}
            </span>
            {filter}
          </button>
        ))}
      </div>

      {foods.length > 0 ? (
        <section className="food-grid" aria-label="Food menu">
          {foods.map((food) => {
            const quantity = quantities[food.id] ?? 0

            return (
              <article
                className={`food-card ${quantity > 0 ? 'is-selected' : ''}`}
                key={food.id}
              >
                <button
                  className="food-card__image-button"
                  onClick={() => onFoodSelect(food)}
                  type="button"
                  aria-label={`View ${food.name}`}
                >
                  <img src={food.image} alt={food.name} />
                </button>

                <div className="food-card__body">
                  <div className="tag-icons" aria-label={food.tags.join(', ')}>
                    {food.tags.map((tag) => (
                      <span key={tag} title={tag}>
                        {tagIcon(tag)}
                      </span>
                    ))}
                  </div>

                  <button
                    className="food-card__content-button"
                    onClick={() => onFoodSelect(food)}
                    type="button"
                  >
                    <h2>
                      {quantity > 0 && `${quantity} × `}
                      {food.name}
                    </h2>
                    <p>{food.description}</p>
                  </button>

                  <div className="food-card__footer">
                    <strong>{formatTHB(food.price)}</strong>
                    <button
                      className="icon-button icon-button--add"
                      onClick={() => onAdd(food)}
                      type="button"
                      aria-label={`Add ${food.name} to order`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      ) : (
        <section className="empty-state">
          <span aria-hidden="true">🍽️</span>
          <h2>No dishes found</h2>
          <p>Try another search or category.</p>
        </section>
      )}
    </main>
  )
}
