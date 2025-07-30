DETAILED IMPLEMENTATION PLAN (only stories < 4.5) ──────────────────────────── Each story becomes a minimal, testable task set (per your PBI policy).
Example shows structure; replicate for remaining stories.

A. Predict Case Outcomes (Score 3.0, Priority H)

Task 1 – Backend route POST /api/v1/outcome/predict • Validate payload -> zod schema
• Authenticate -> Supabase JWT
• Persist to cases
2. Task 2 – Gemini service wrapper
• Move prompt string to /prompts/outcome.ts (DRY)
• Add caching logic (key = hash of payload)
3. Task 3 – Judge-behavior feature flag
• Enrich prompt with judge stats table (placeholder now)
4. Task 4 – Unit + integration tests (jest + supertest)
5. Task 5 – Front-end hook to call backend instead of Gemini directly; show loading/progress.
B. Optimize Legal Strategies (2.8, H) • Similar 5-task breakdown; uses strategies table.

C. Simulate Case Strategies (2.5, H)
• Add async job handler (queue table / Netlify background).

D. Forecast Regulatory Changes, … (repeat for each).

Cross-Cutting Tasks • PBI “Authentication & Env Setup” – implement .env, Supabase helper (score 2.0 → 5).
• PBI “Testing Infrastructure” – jest config, GitHub Actions.

 