# Preview Fixes 15

Review Order Request repair:

- Converted Review Order Request into a dedicated button with its own click handler.
- It no longer depends solely on the browser's form-submit event.
- If a required field is missing, the browser shows the validation message and the page scrolls to the first invalid section.
- Conditional fields are only required when their option is actually selected.
- If the form is valid, the Order Review dialog opens directly.
- Enter-key form submission still opens the same review.
- Updated stale review-summary field names for Stuffed Animal and Extra Words.
