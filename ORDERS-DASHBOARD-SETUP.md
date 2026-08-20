# Heart & Soul Orders Dashboard — v6

This version adds a real owner-facing Orders Dashboard at:

https://heartandsoulmums.netlify.app/orders/

It reads the existing `mum-order` submissions from Netlify Forms and displays them
in a clean business-friendly interface.

## Dashboard features
- Search by student, customer, school, order number, or promo code
- Filter by order status
- New / Active / In Production / Ready / Completed totals
- Clean customer and student information
- Readable dates and phone numbers
- Actual color swatches plus color name AND hex code
- Upgrades, activities, custom instructions, and referral attribution
- Click-to-call, click-to-text, and email customer buttons
- Print-friendly order sheet
- Shared statuses:
  - New
  - Design Approved
  - In Production
  - Ready for Pickup
  - Completed
  - Cancelled

## One-time Netlify setup required

The dashboard intentionally does NOT expose your Netlify API token in the browser.
A Netlify Function reads orders securely.

In Netlify go to:
Project configuration → Environment variables

Create these variables:

### NETLIFY_ACCESS_TOKEN
Create a personal access token in your Netlify user settings, then paste it as the value.
Treat this like a password. Never put it in GitHub.

### MUM_ORDER_FORM_ID
Use the ID from the `mum-order` Forms URL.
From the current screenshot, the form URL ended in:
`6a87679b42bf980008f17a04`

Verify that ID is still the `mum-order` form before saving it.

### OWNER_DASHBOARD_KEY
Choose a private password for your grandmother/sister to use on `/orders/`.
Use something unique. Do NOT commit it to GitHub.

After adding/changing environment variables, trigger a new Netlify deploy.

## Important
The dashboard's order-status values are stored with Netlify Blobs so status updates are
shared across devices rather than living only in one browser.

The Decap `/admin/` editor remains for changing the website itself.
The `/orders/` dashboard is for managing customer orders.
