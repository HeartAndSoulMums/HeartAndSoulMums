# Test Order Mode — Full Payment

Use this dedicated URL after Netlify redeploys:

https://heartandsoulmums.netlify.app/test/

This route is intentionally separate from `/admin/`, so Decap's `#/collections/...`
admin routing cannot interfere with test ordering.

## Test flow
1. Open `/test/`.
2. Confirm the yellow TEST MODE banner is visible.
3. Fill out a mock customer order.
4. Click **Review Order Request**.
5. Click **Simulate Paid Test Order**.
6. The owner view will show:
   - `PAID IN FULL — TEST`
   - the full amount paid
   - `$0.00` balance due

Nothing is charged, stored, emailed, submitted, or counted toward referrals.
