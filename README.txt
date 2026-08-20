Heart & Soul Signature Mums — Premium Website Prototype

Open index.html locally, or upload all files in this folder to Netlify.

This version incorporates the proposed premium pricing strategy:
- Classic: $195+
- Signature: $325+
- Deluxe: $450+
- Showstopper: $600+ / custom quote
- Size, length and fullness priced separately
- Premium upgrade packages
- Specialty braids and custom printed ribbon
- Detailed student personalization
- Inspiration photo selection
- 50% estimated deposit
- Proposed rush and change policies

IMPORTANT:
All prices, deposits and policies are currently proposed values. Heart & Soul Signature Mums should approve them before public launch.

The current form is still a front-end prototype. It does not yet:
- store orders in a database
- upload photos to cloud storage
- send automatic emails/texts
- collect payment

Those can be connected next.

STUDENT REFERRAL SYSTEM
- This site now has a private student promo-code field.
- Valid codes receive 10% off the estimated order total.
- The student's name, school and code are attached to the order summary.
- There is NO public ambassador application or ambassador page.
- Only hand-selected students should be added to PROMO_CODES in script.js.
- REVIEW10 is a temporary test code. Remove it before public payment launch.
- For the "5 completed purchases = free mum" reward, only completed/paid/qualified orders should count.
- Automatic cross-customer referral counting requires the future payment/order database. The current prototype records the referral on each order so that integration can be added cleanly.


Owner Orders Dashboard: /orders/
See ORDERS-DASHBOARD-SETUP.md for one-time Netlify environment-variable setup.
