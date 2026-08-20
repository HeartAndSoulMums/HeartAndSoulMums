# Heart & Soul — Readable Orders Fix

This build intentionally simplifies the Orders Dashboard.

What it does:
- Owner password authentication
- Pulls `mum-order` submissions directly from Netlify Forms
- Shows the clean Orders Dashboard
- Color swatches + readable color names + hex codes
- Customer/student details, upgrades, totals, referral code, contact actions
- Print-friendly order detail

What is temporarily simplified:
- Order status changes are not persisted yet.
- They can be changed on screen, but refresh resets them to New.

Why:
The previous build was hanging while the dashboard tried to initialize order status
storage. This version removes that dependency so we can prove the core order dashboard
works first.

No environment-variable changes are required if all three already show configured.
