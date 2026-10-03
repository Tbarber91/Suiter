# Careerly — React Style Kit

A SEEK-style design system + starter app in React. Copy these files into your
project (or paste them into AI Studio as a reference for the model to follow).

## What's included

**5 screens** with state-based navigation (no router dependency):
- `HomePage` — navy hero, company carousel, promo blocks, feature pillars
- `SearchResultsPage` — filterable job list with chips
- `JobDetailPage` — navy detail header, bullet sections, sticky apply bar
- `LoginPage` — centered form with social sign-in
- `ProfilePage` — avatar header, completion progress bar, account rows

**Reusable components:**
- `TopBar`, `Hero`, `CompanyCard`, `PromoBlock`, `FeaturePillars`
- `Button` (outline / primary / pink variants)
- `Footer` + `BottomNav` (5-tab nav)
- `Icons` — inline SVG icon set (no icon library needed)

**Design tokens** in `src/styles/tokens.css`:
- All colors, radii, shadows, spacing, typography as CSS variables
- Change them once to re-skin the whole app
- An alternate emerald theme is included (commented out) — uncomment to switch

## File structure

```
careerly-react/
  index.html              # entry HTML (loads Inter font)
  package.json            # React 18 + Vite
  vite.config.js
  src/
    main.jsx              # React mount point
    App.jsx               # route state + screen switching
    data.js               # sample companies/jobs (replace with your API)
    styles/
      tokens.css          # design tokens + base reset
      components.css      # all component styles
    components/
      Icons.jsx           # SVG icon set
      Button.jsx
      TopBar.jsx
      Hero.jsx
      CompanyCard.jsx
      PromoBlock.jsx
      FeaturePillars.jsx
      Footer.jsx          # Footer + BottomNav
    pages/
      HomePage.jsx
      SearchResultsPage.jsx
      JobDetailPage.jsx
      LoginPage.jsx
      ProfilePage.jsx
```

## Run it locally

```bash
npm install
npm run dev
```

## Using it in AI Studio

Copy the contents of `src/` (and the two CSS files) into your AI Studio prompt:

> Here's my design system and React components. Build my app using these exact
> styles, colors, component classes, and structure.

The CSS variables at the top of `tokens.css` are the single source of truth for
the look — point the model at those first.

## Customizing colors

Edit `src/styles/tokens.css`:

```css
:root {
  --navy-900: #0c2340;  /* hero background, primary button */
  --pink-500: #e63988;  /* stars, accents */
  /* ...change these and everything updates */
}
```

To use the alternate emerald palette, find the `[data-theme="emerald"]` block
and uncomment it, then add `data-theme="emerald"` to your `<html>` tag.
