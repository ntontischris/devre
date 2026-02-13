# CI/CD Setup Guide

## Quick Start

### 1. GitHub Actions Setup (Already Done)
The CI pipeline is configured in `.github/workflows/ci.yml` and will run automatically when you push to `main` or create a pull request.

**Optional:** Add GitHub Secrets (if you want realistic builds in CI):
1. Go to: Repository → Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_APP_URL`

**Note:** The CI will use fallback values if these secrets are not set, so builds will still pass.

### 2. Vercel Setup (First Time)

#### Option A: Via Vercel Dashboard (Recommended)
1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js and use `vercel.json` config
5. Add environment variables (see below)
6. Click "Deploy"

#### Option B: Via CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Login
vercel login

# Deploy (from project root)
vercel

# Follow prompts to link/create project
```

### 3. Configure Vercel Environment Variables

Navigate to: Vercel Dashboard → Your Project → Settings → Environment Variables

Add these variables for each environment (Production, Preview, Development):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Stripe
STRIPE_SECRET_KEY=sk_live_... (or sk_test_... for Preview)
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (or pk_test_... for Preview)

# Resend
RESEND_API_KEY=re_...

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

**Pro Tip:** Use different Stripe keys for Preview vs Production:
- Production: `sk_live_...` / `pk_live_...`
- Preview: `sk_test_...` / `pk_test_...`

### 4. Test the Pipeline

```bash
# Create a feature branch
git checkout -b test-ci-cd

# Make a small change
echo "# Test" >> test.txt

# Commit and push
git add .
git commit -m "Test CI/CD pipeline"
git push origin test-ci-cd

# Open a pull request on GitHub
# → GitHub Actions will run CI checks
# → Vercel will create a preview deployment
```

## Deployment Flow

### Automatic Deployments
```
Push to main → GitHub Actions (CI) → Vercel (Production Deploy)
                     ↓
              ✓ Type check
              ✓ Lint
              ✓ Build
```

### Pull Request Flow
```
Create PR → GitHub Actions (CI) → Vercel (Preview Deploy)
                  ↓
           ✓ Type check
           ✓ Lint
           ✓ Build

           → Review preview deployment
           → Merge when ready
           → Automatic production deploy
```

## Common Commands

```bash
# Local development
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Build (same as CI)
npm run build

# Deploy to Vercel (manual)
vercel --prod
```

## Troubleshooting

### CI Build Fails
1. Run locally: `npm run build`
2. Check environment variables in GitHub Secrets
3. Review GitHub Actions logs

### Vercel Deployment Fails
1. Check Vercel deployment logs
2. Verify environment variables in Vercel dashboard
3. Test build locally: `npm run build`

### Environment Variables Not Working
```bash
# Pull Vercel env vars to local (for testing)
vercel env pull .env.local

# List configured env vars
vercel env ls
```

## Next Steps

1. **Enable Playwright Tests:** Uncomment the `test` job in `.github/workflows/ci.yml`
2. **Configure Stripe Webhooks:** Point webhooks to your production URL
3. **Set Up Monitoring:** Configure Vercel analytics and error tracking
4. **Domain Setup:** Add custom domain in Vercel dashboard

## Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
