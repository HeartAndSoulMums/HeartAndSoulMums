# Preview Fixes 18

Submit Order 404 fix:

- Removed the Preview 17 submission interceptor that was calling the wrong endpoint.
- Restored the website's original submission pipeline.
- Submit Order now:
  1. submits the Netlify form,
  2. saves the private order through `/.netlify/functions/save-order`,
  3. stores it in Netlify Blobs for the owner dashboard,
  4. opens the confirmation dialog with the order number and total.
- The correct Netlify Functions route uses `/.netlify/functions/...` (with the leading dot).
- Test mode behavior remains unchanged: real Submit Order is hidden/blocked there.
