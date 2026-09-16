# Site review rules

- Check whether this worktree already has a healthy server.
- Reuse it when available. - Never kill or restart another process.
- Never use pkill, killall, taskkill, fuser -k, or broad Node process termination.
- Do not run a production build while this worktree's development server is running.
- Run lint and typecheck without restarting the server. Do not commit, push, publish, deploy, merge, or modify unrelated pages.
- After implementation:
- 1. Run lint/typecheck.
- 2. Open localhost in this worktree's browser.
- 3. Compare it with the attached reference.
- 4. Fix the highest-impact mismatch.
- 5. Repeat until closely matched.
- 6. Give me the localhost port its running on and the page it modifies 
