# Yulina Dev

A public learning project for creating, searching, filtering, updating and deleting support tickets. React + TypeScript frontend; Cloudflare Worker API and D1 SQL storage. Responsive layouts and keyboard-accessible controls.

## Cloudflare deployment
Connect this repository to Workers & Pages. Set the Worker name to `yulina-dev`, build command to `npm run build`, deploy command to `npx wrangler deploy`, root directory to `/`, and production branch to `main`. Use Node 22 or later. Wrangler provisions the D1 binding `DB` on deployment; the API creates its table on first use. The build token must permit Worker deployment and D1 provisioning. Use the free plan within its limits.

The new deployment uses a new empty database, not the existing hosted app’s records. This is a shared public demo; anyone visiting can change demo tickets. It has no user accounts. Use sample tickets.

## Local development
`npm install`, `npm run build`, then `npm run preview`. Wrangler provides a local D1 database. `npm run check` checks TypeScript. Tickets persist across refreshes and devices on the hosted version because they are stored in SQL.

## Check your deployment
Open the generated public URL without signing in. Create a sample ticket, filter it, change its status, refresh and verify persistence. Check phone layout and keyboard navigation. Delete the sample ticket after testing.
