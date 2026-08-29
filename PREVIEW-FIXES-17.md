# Preview Fixes 17

Submit Order repair:

- Added a dedicated Submit Order click handler.
- Submission no longer depends on stale legacy field names.
- The submit button now builds the order payload from the current form fields.
- It posts directly to `/netlify/functions/orders`.
- The button shows "Submitting..." and prevents duplicate submissions.
- Backend errors are surfaced to the customer instead of making the button appear dead.
- Conditional required fields are validated before submission.
- In test mode, real submission remains intentionally blocked.
- Successful submission shows the returned order number when available.
- Promo/referral attribution remains included in the order payload.
- Photo add-on currently submits the selected photo filename only; actual image bytes are not yet stored.
