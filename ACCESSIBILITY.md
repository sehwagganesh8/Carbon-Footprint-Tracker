# Accessibility Governance

This project adheres strictly to **WCAG 2.1 AA Standards**.

## Enforced Patterns:
- **Semantic HTML**: `<main>`, `<article>`, `<section>`, `<header>`, `<footer>` instead of standard div wrappers.
- **Form Controls**: All inputs must have linked explicit `<label>` elements or descriptive `aria-label`/`aria-describedby` attributes.
- **Keyboard Navigation**: Interactive elements must be usable via tab routing. Custom buttons or widgets require `tabIndex={0}` and handlers for `Enter` or `Space` keys.
- **Aria Standards**: SVGs and decorative items must include `aria-hidden="true"`. Live updating segments require `aria-live="polite"`.

We validate our UI through automated CI pipelines leveraging `eslint-plugin-jsx-a11y` and `vitest-axe`.
