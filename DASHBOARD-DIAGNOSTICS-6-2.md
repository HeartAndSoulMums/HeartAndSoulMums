# Orders Dashboard v6.2 diagnostics

After deploying, open:

https://heartandsoulmums.netlify.app/orders/

Under the Open Orders button, the page now reports whether these required Netlify
environment variables are visible to the server function:

- OWNER_DASHBOARD_KEY
- NETLIFY_ACCESS_TOKEN
- MUM_ORDER_FORM_ID

It never displays the values themselves.

You can also open:
https://heartandsoulmums.netlify.app/.netlify/functions/orders?health=1

Expected healthy response:
{"ok":true,"ownerKeyConfigured":true,"accessTokenConfigured":true,"formIdConfigured":true,...}

The customer/order API also has timeouts now, so the UI will show an error rather
than remaining on Connecting indefinitely.
