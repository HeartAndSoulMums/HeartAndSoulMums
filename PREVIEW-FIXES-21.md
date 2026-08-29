# Preview Fixes 21 — Section 7 Inspiration Photos

Section 7's "Choose Files" upload now stores the actual inspiration photos.

New behavior:
- Customer can choose up to 3 Section 7 inspiration photos.
- Each photo is resized/compressed in the browser before submission.
- Actual image data is stored privately in Netlify Blobs:
  - `inspiration:<orderNumber>:0`
  - `inspiration:<orderNumber>:1`
  - `inspiration:<orderNumber>:2`
- The order record tracks `inspirationCount` and `hasInspirationPhotos`.
- `/orders/` retrieves the images through the existing password-protected orders function.
- The images appear directly inside **Custom Vision + Instructions** as an Inspiration Photos gallery.

This is separate from the paid Photo +$35 add-on. Both upload systems now store and display their actual images.

Important:
- Inspiration photos from orders submitted before this deployment were never stored and cannot be recovered from the order database.
- New orders submitted after deployment will show the Section 7 photos.
