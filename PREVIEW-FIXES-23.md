# Preview Fixes 23 — Correct Length Option

Fixed the order submission bug that caused Length Option to always save as Standard.

New behavior:
- Submission reads the actual visible `select[name="length"]` dropdown.
- Standard saves as `Standard`.
- Long saves as `Long` and displays 30 in.
- Extra Long saves as `Extra Long` and displays 36 in.
- Owner dashboard now prioritizes the saved selected length option before falling back to package standard length.

This affects new orders submitted after this deployment.
