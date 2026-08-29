# Preview Fixes 22 — Length Saved + Displayed

Fixed the missing length data in owner orders.

New submissions now always save:
- `baseLength`
- `length`
- `fullness`

Base lengths:
- Mini Mum: 10 in
- Garter: 12 in
- Classic: 24 in
- Signature: 24 in
- Signature Plus: 24 in
- Showstopper: Custom / quote

Length upgrades:
- Standard: package base length
- Long: 30 in
- Extra Long: 36 in

The `/orders/` Mum Build card now shows:
- Package
- Length (actual inches)
- Length option
- Fullness
- Style

Important: old orders created before this deployment may still have blank length fields because that data was not saved at submission time.
