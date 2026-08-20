# Order workflow — v5

## Customer
1. Customer customizes a mum.
2. Customer clicks Review Order Request.
3. Customer reviews the full order.
4. Customer clicks Submit Order.
5. The order is submitted through Netlify Forms.
6. Customer sees an order-confirmation screen with an order reference.

## Owner
Until a custom order dashboard is built, orders are stored in Netlify:

Netlify Dashboard → HeartAndSoulMums → Forms → mum-order

Each submission includes the customer information, student details, custom options,
estimated total, promo/referral information, and a complete order summary.

## Test mode
Use:
https://heartandsoulmums.netlify.app/test/

Test mode NEVER submits to Netlify Forms.

## Recommended next step
After confirming real order submissions work, enable Netlify form submission
email notifications so the owners receive an email every time a new order arrives.
Payment should be connected after the ordering workflow is verified.
