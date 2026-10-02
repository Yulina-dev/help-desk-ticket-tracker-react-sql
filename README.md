# Help Desk Ticket Tracker — React + SQL

A React help desk dashboard with a server API and a SQLite-compatible Cloudflare D1 database. Tickets persist across refreshes and devices when using the hosted workspace.

## Features
Create tickets with a title, category, priority and status. Search and filter the queue, update status, and delete with confirmation. Responsive keyboard-accessible interface; loading, empty and recoverable error states.

## Architecture
- `app/page.tsx`: React components, form state, filters, API requests.
- `app/api/tickets/route.ts`: GET, POST, PATCH and DELETE handlers with validation and parameterized SQL.
- `db/schema.ts`: SQL schema source.
- `drizzle/`: generated SQL migrations.
- `db/tickets.ts`: server-only database binding helper.
- `app/globals.css`: responsive UI design.

The hosted site starts private. This is a learning project with a shared workspace dataset, not a multi-tenant production help desk. There is no application-level user management.

## Get the source

Download `ticket-desk-source.zip` and extract it into a folder. The archive contains the complete React application, API routes, SQL migrations, UI components, and build configuration. The source is packaged as an archive in this repository.

## Local development
Install dependencies using the existing package manager, generate migrations with `npm run db:generate` after schema changes, and use the starter's documented local D1 migration procedure before starting development. `npm run dev` starts the React app. The hosted platform provisions D1 and applies committed migrations when publishing.

## SQL examples
```sql
SELECT id, title, category, priority, status FROM tickets ORDER BY created_at DESC;
UPDATE tickets SET status = ? WHERE id = ?;
```

## Manual checks
Create a ticket and refresh; verify it remains. Search its title and filter its status/category. Update to Resolved, refresh and confirm persistence. Cancel deletion, then confirm deletion and verify the queue count. The app reports a failed request without clearing the form.

## Live app
[Open Yulina Ticket Desk](https://yulina-ticket-desk.yulinaandoolo20.chatgpt.site) (owner-only access).
