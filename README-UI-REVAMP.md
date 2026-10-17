# LEORÉ Static UI Revamp

This patch is a responsive React/Vite front-end prototype using the existing `src/data/products.json` and product images.

## Files
- `src/App.jsx` — homepage, collections, product details, cart page/drawer, search, About, FAQ, Shipping & Returns, Contact and checkout placeholder.
- `css/style.css` — responsive design system and styles.
- `index.html` — app entry HTML.

## Apply
Copy these files into the root of the existing repository, replacing matching files. Keep `src/main.jsx`, `src/data/products.json`, `public/assets/products/`, `package.json`, and your lockfile unchanged.

## Run locally
```sh
npm install
npm run dev
```

## Prototype boundaries
- Product data is read from the existing JSON catalogue.
- Cart contents are saved in this browser's localStorage.
- Search, filters, sorting, quick view, size selection and cart controls work locally.
- Contact and newsletter forms only show local UI feedback.
- No payment processing, order creation, backend, account system, inventory sync, email delivery or shipping integration is included.
- Hash routes such as `#/shop` work on static hosting without server rewrites.
- This patch does not deploy or change GitHub.
