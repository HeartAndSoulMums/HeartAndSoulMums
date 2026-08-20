# Orders Dashboard v6.1

This patch fixes the silent-login problem.

Changes:
- Shows immediate proof that dashboard JavaScript loaded.
- Shows "Connecting…" after clicking Open Orders.
- Displays the exact server/API error instead of silently doing nothing.
- Adds cache-busting to the dashboard JavaScript.
- Allows orders to load even if status-storage initialization fails.

After upload + deploy, refresh `/orders/` with Ctrl+Shift+R.
