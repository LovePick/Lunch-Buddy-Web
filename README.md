# Lunch Buddy Web

A responsive React + TypeScript demo for teaching AI-assisted software development with Copilot.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Verify the project

```bash
npm test
npm run build
```

## Teaching-friendly structure

- `src/App.tsx` — application state and user interactions
- `src/components/` — menu, food detail and checkout UI
- `src/checkout.ts` — readable checkout business rules
- `src/checkout.test.ts` — six acceptance scenarios as automated tests
- `src/menu.ts` — demo food data

## Checkout rules

1. The order must contain at least one item.
2. Subtotal cannot exceed 1,000 THB.
3. Subtotal greater than 200 THB receives a 10% discount.
4. Coupon `LUNCH50` provides an additional 50 THB discount.
5. Apply the order discount before the coupon discount.
6. Final payable amount cannot be negative.
