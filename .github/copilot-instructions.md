# Copilot instructions for GP-Quick-Force

## Project shape
- This repo is a small React + Vite admin frontend for a car catalog, backed by a local Express mock API.
- The runtime flow is: [src/main.jsx](src/main.jsx) → [src/App.jsx](src/App.jsx) → [src/components/AdminPage.jsx](src/components/AdminPage.jsx) → [src/components/AdminCarsList.jsx](src/components/AdminCarsList.jsx) → [src/api/cars.js](src/api/cars.js) → [server/index.js](server/index.js).
- The UI currently focuses on listing and deleting cars; the mock API also exposes create/update endpoints for future admin flows.

## Architecture and data flow
- Keep API calls centralized in [src/api/client.js](src/api/client.js) and [src/api/cars.js](src/api/cars.js); `axios` is configured with `baseURL: http://localhost:4000/api`.
- The server stores data in memory only, so restarting [server/index.js](server/index.js) resets the sample cars.
- CORS is enabled on the mock API; the frontend and API run on different ports during development.
- `AdminPage` owns toast state and refresh signaling; `AdminCarsList` owns fetching, loading/error state, and delete confirmation.

## UI patterns to preserve
- User-facing text is in Spanish (for example: “Listado”, “Eliminar”, “Confirmar eliminación”, “No hay vehículos”).
- Delete flows are optimistic in the UI: after a successful DELETE, the item is removed from local state without a full reload.
- Confirmation and notifications are handled by [src/components/ConfirmDialog.jsx](src/components/ConfirmDialog.jsx) and [src/components/Notification.jsx](src/components/Notification.jsx); reuse these instead of introducing ad hoc modals/toasts.
- Styling is global in [src/styles.css](src/styles.css) and relies on class names such as `.admin-list`, `.cars-grid`, `.car-card`, `.confirm-overlay`, and `.notification`.

## Important project conventions
- `App.jsx` is a thin shell; avoid adding routing or extra layout layers unless the app grows beyond the current admin view.
- Prefer functional components with hooks; the current code uses `useState` and `useEffect` only.
- The Vite alias `@` points to `src` ([vite.config.js](vite.config.js)), but current imports are mostly relative.
- `AdminCarsList` disables exhaustive-deps linting around its loading effects; preserve that pattern unless the data-loading logic changes.

## Developer workflow
- Install dependencies with `npm install`.
- Run the mock API with `npm run server` and the frontend with `npm run dev`; the app expects the API at port 4000.
- Build the frontend with `npm run build` and preview the production bundle with `npm run preview`.
- There is no dedicated test or lint script in [package.json](package.json), so verify changes by running the app and checking the browser console and terminal output.

## When editing code
- Keep API changes mirrored between [src/api/cars.js](src/api/cars.js) and [server/index.js](server/index.js).
- If you add new admin actions, wire them through `AdminPage`/`AdminCarsList` rather than calling the API directly from leaf components.
- Prefer small, localized changes that preserve the current state shape and Spanish copy.
