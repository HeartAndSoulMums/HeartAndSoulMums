# Preview Fixes 11

Package pricing + color behavior repair:

- Fixed a missing `syncConditionalDetails()` helper that was stopping the live estimate calculation.
- The Live Estimate now reads the price from the currently selected package:
  - Mini Mum $65
  - Garter $115
  - Classic $195
  - Signature $260
  - Signature Plus $325
  - Showstopper $500 starting price
- Package changes refresh the estimate immediately.
- Color fields now follow package rules immediately:
  - Mini Mum / Garter / Classic = 2 standard colors
  - Signature / Signature Plus / Showstopper = 3 standard colors
  - All retain the filler/accent color field.
- Also corrected Extra Words math so the $7 base checkbox and quantity selector do not double-charge.
- School Name remains free.
