# How to Test Locally

You can test your UI changes locally by generating baseline snapshots from the main branch and comparing them against your feature branch.

```bash
# 1. Generate baseline from main branch
git checkout main
git pull origin main
cd fe
yarn test:update  # Creates baseline snapshots

# 2. Switch to your feature branch
git checkout your-feature-branch

# 3. Run tests
yarn test  # Compares against baseline

# 4. If tests fail, review changes
yarn test:ui  # Opens UI to see visual diffs
# or
yarn playwright show-report  # Opens report in browser
```

> [!IMPORTANT]
> Snapshots are not committed to the repository