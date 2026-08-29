# Preview Fixes 20 — Real Photo Storage

New customer photo uploads are now actually stored and viewable by the owner.

Flow:
1. Customer selects the Photo +$35 add-on and chooses an image.
2. Before submission, the browser resizes the image to a maximum 1600px side and converts it to compressed JPEG.
3. `save-order` stores the photo privately in the existing `heart-and-soul-orders` Netlify Blobs store under `photo:<orderNumber>`.
4. The order JSON stores only photo metadata (`photoAddonFile`, `hasPhoto`) so the normal order list stays lightweight.
5. The private owner dashboard requests the photo through the authenticated `/orders` Netlify function only when an order is opened.
6. The uploaded image is displayed in an **Uploaded Photo** card in `/orders/`.

Privacy:
- Photo blobs are not exposed at a public URL.
- The dashboard must provide the existing owner password before the photo endpoint returns the image.

Important:
- Older orders submitted before this change only saved the filename. Their original image bytes cannot be recovered from this order store.
- New submissions after this deployment will store and display the image.
