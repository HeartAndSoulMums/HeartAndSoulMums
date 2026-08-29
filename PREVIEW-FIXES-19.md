# Preview Fixes 19

Submit Order standalone controller:
- Submit Order no longer depends on the main form JavaScript reaching its old listener.
- It validates the current form.
- It posts directly to the existing `/.netlify/functions/save-order` function.
- It uses the payload schema expected by `save-order.mjs`.
- It preserves Kennedy10 referral attribution.
- It shows "Submitting…" while working.
- It shows the backend error if Netlify rejects the request.
- On success it opens the existing confirmation dialog with the order number and total.
- Real submission remains blocked in test mode.
