# Copilot Bug Hunt Exercise

This exercise demonstrates that Copilot can help with code review, test generation and debugging—not only code generation.

## Files

- `checkout.buggy.ts` — intentionally incorrect checkout implementation
- `checkout.buggy.test.ts` — correct expected behaviour; failures reveal defects
- `../checkout.ts` — production implementation for comparison after the exercise
- `../checkout.test.ts` — passing production acceptance tests

## Suggested lesson flow

### 1. Review without changing code

Open `checkout.buggy.ts` and ask Copilot:

> Review this checkout implementation against REQUIREMENTS.md. Do not edit the code yet. List every mismatch with the business rules and explain an input that demonstrates each problem.

### 2. Run the bug-hunt tests

```bash
npm run test:buggy
```

The failures are intentional. Ask Copilot:

> Explain why each failing test fails. Map every failure to its acceptance criterion. Do not fix the code yet.

### 3. Fix one rule at a time

Ask Copilot:

> Fix only the empty-order validation. Keep all other behaviour unchanged, then run the bug-hunt tests again.

Repeat for each remaining defect so learners can see the feedback loop.

### 4. Verify the finished solution

When all bug-hunt tests pass, run the production suite and build:

```bash
npm test
npm run build
```

### 5. Compare implementations

Compare the repaired exercise with `src/checkout.ts`. Discuss naming, small functions, constants, comments and why tests are the source of truth—not Copilot's confidence.

## Resetting the exercise

Use Git to restore the intentionally buggy starting point after the class:

```bash
git restore src/teaching/checkout.buggy.ts
```
