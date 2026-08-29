# Preview Fixes 12

Live Estimate package pricing fix:

The package price display now uses a direct, authoritative package-price map:
- Mini Mum: $65
- Garter: $115
- Classic: $195
- Signature: $260
- Signature Plus: $325
- Showstopper: $500 starting price

Package price and estimated total are updated immediately when a package radio button
or top "Choose..." package button is selected, before any optional/add-on calculations run.

This removes the condition that allowed the estimate to remain stuck at $195 if another
piece of form logic encountered an error.
