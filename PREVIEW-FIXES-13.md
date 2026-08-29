# Preview Fixes 13

Core package behavior was moved into a separate fail-safe controller.

This controller works independently of the main form script and guarantees:

- Top package buttons select the intended package.
- Top package buttons smooth-scroll to Step 1.
- Package radio selections immediately update the Live Estimate.
- Base prices:
  - Mini Mum $65
  - Garter $115
  - Classic $195
  - Signature $260
  - Signature Plus $325
  - Showstopper $500
- Signature, Signature Plus, and Showstopper show 3 standard color fields.
- Mini Mum, Garter, and Classic show 2 standard color fields.
- Length/fullness, paid add-ons, braids, printed ribbon, and Extra Words are included in the visible estimate.

The fail-safe is intentionally isolated so an error elsewhere in the order-form JavaScript cannot prevent package navigation or package-price updates.
