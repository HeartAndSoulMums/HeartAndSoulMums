# Heart & Soul Owner Controls — v2

This update makes the business-facing parts of the website editable from `/admin/`.

## Owners can now edit
- Logo / branding
- Business name and tagline
- Phone, email, Instagram, Facebook, service area
- Announcement bar
- Homepage wording
- All package and upgrade prices
- Deposit percentage and ordering availability
- Pickup instructions and minimum lead time
- Student promo codes and referral rules
- Senior section
- Policies and rush fees
- Photo gallery / image uploads
- Footer text

## How publishing works
Edit in `/admin/` → click Publish → Decap commits `content/site.json` or uploaded media to GitHub → Netlify automatically redeploys.

## Important
This update does not yet add a payment processor, database-backed referral counts, or cloud storage for customer inspiration uploads. Those are backend/payment features, separate from owner content editing.


## Full-payment workflow
The site now assumes customers pay the full amount before production begins.
Deposit-percentage controls have been removed.

## Safe test ordering
Use `/test/` to simulate a paid-in-full order without charging or storing anything.
