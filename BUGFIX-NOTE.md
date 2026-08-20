# v5 Button Fix

Fixed a JavaScript error caused by the removed `copyOrder` button.
That error prevented later button handlers from loading.

Also changed test mode so:
- `/test/` hides the real **Submit Order** button
- `/test/` shows only **Simulate Paid Test Order**
- normal customer site shows **Submit Order**
