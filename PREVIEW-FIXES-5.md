# Preview Fixes 5

Package CTA navigation was rebuilt.

When a customer clicks:
- Choose Mini Mum
- Choose Garter
- Choose Classic
- Choose Signature
- Choose Signature Plus
- Start a Showstopper

the site now:
1. Selects that package in Step 1.
2. Immediately smooth-scrolls to Step 1 ("Choose your mum").
3. Leaves the selected package checked so the customer can continue into Step 2.
4. Performs price recalculation only after scrolling, so a calculation error cannot prevent navigation.
5. Uses explicit type="button" package CTAs to prevent accidental form-submit behavior.

All changes from Preview Fixes 4 remain included.
