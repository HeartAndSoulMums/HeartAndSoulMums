# Test Order Mode

After this version is deployed, add `?test=1` to the normal website URL:

`https://heartandsoulmums.netlify.app/?test=1`

Then:
1. Fill out a mock order.
2. Click **Review Order Request**.
3. The review modal will show **Simulate Paid Test Order**.
4. Click it to open the owner-side **New order received** view.
5. No payment is charged and nothing is submitted, stored, emailed, or counted toward referrals.

The normal URL without `?test=1` does not show the simulation button.
