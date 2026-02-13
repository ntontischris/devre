# Deployment Runbook - Devre Media System

## Overview
This document outlines the deployment process for the Devre Media System (DMS), a Next.js 16 application deployed on Vercel with Supabase backend.

## Prerequisites

### Required Accounts
- GitHub account with repository access
- Vercel account (connected to GitHub)
- Supabase project (cloud instance)
- Stripe account (test and production keys)
- Resend account (for email)

### Required Tools
- Node.js 20.x
- npm 10.x
- Git

## CI/CD Pipeline

### GitHub Actions (Continuous Integration)
The CI pipeline runs automatically on:
- Push to `main` branch
- Pull requests to `main`

Pipeline steps:
1. Checkout code
2. Setup Node.js 20 with npm cache
3. Install dependencies (`npm ci`)
4. Type check (`npm run type-check`)
5. Lint (`npm run lint`)
6. Build (`npm run build`)

**Secrets Required in GitHub:**
- `NEXT_PUBLIC_SUPABASE_URL` (optional, has fallback)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional, has fallback)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (optional, has fallback)
- `NEXT_PUBLIC_APP_URL` (optional, has fallback)

### Vercel (Continuous Deployment)
Vercel automatically deploys on:
- Push to `main` → Production deployment
- Pull requests → Preview deployments

## Initial Vercel Setup

### 1. Connect Repository
```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Login to Vercel
vercel login

# Link project (run in project root)
vercel link
```

### 2. Configure Environment Variables
Navigate to Vercel Dashboard → Project Settings → Environment Variables

Add the following variables for **Production**:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

For **Preview** environments (optional):
- Use the same variables or separate test credentials
- Recommended: Use Stripe test keys for preview deployments

### 3. Deploy
```bash
# Deploy to production
vercel --prod

# Or simply push to main branch for automatic deployment
git push origin main
```

## Environment Configuration Strategy

### Local Development
- Use `.env.local` (not tracked in git)
- Copy from `.env.example`
- Uses local Supabase instance (http://127.0.0.1:54321)
- Uses Stripe test keys

### Preview/Staging (Vercel)
- Automatic deployment on pull requests
- Uses test/staging environment variables
- Isolated from production data

### Production (Vercel)
- Automatic deployment on push to main
- Uses production environment variables
- Connected to production Supabase and Stripe

## Deployment Checklist

### Pre-Deployment
- [ ] All tests pass locally
- [ ] TypeScript type check passes (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables configured in Vercel
- [ ] Database migrations applied in Supabase
- [ ] Stripe webhooks configured to point to production URL

### Deployment
- [ ] Create pull request with changes
- [ ] CI pipeline passes on GitHub
- [ ] Preview deployment succeeds on Vercel
- [ ] Code review approved
- [ ] Merge to main branch
- [ ] Production deployment succeeds
- [ ] Verify deployment health

### Post-Deployment
- [ ] Verify application loads correctly
- [ ] Test critical user flows (auth, payments, media upload)
- [ ] Check error monitoring (Vercel logs)
- [ ] Verify database connections
- [ ] Test Stripe webhook delivery
- [ ] Monitor performance metrics

## Rollback Procedures

### Immediate Rollback (< 5 minutes)
If a deployment causes critical issues:

1. **Via Vercel Dashboard:**
   - Go to Deployments tab
   - Find last known good deployment
   - Click "..." menu → "Promote to Production"
   - Confirms rollback

2. **Via Vercel CLI:**
   ```bash
   # List recent deployments
   vercel ls

   # Promote specific deployment
   vercel promote <deployment-url>
   ```

### Git Revert (for persistent issues)
```bash
# Revert the problematic commit
git revert <commit-hash>

# Push to trigger new deployment
git push origin main
```

### Emergency Maintenance Mode
If you need to take the app offline:

1. Create a simple maintenance page
2. Deploy as a separate branch
3. Promote to production temporarily

## Monitoring & Health Checks

### Vercel Built-in Monitoring
- Deployment logs: Vercel Dashboard → Deployments → [deployment] → Build Logs
- Runtime logs: Vercel Dashboard → Deployments → [deployment] → Runtime Logs
- Analytics: Vercel Dashboard → Analytics tab

### Application Health Checks
- Verify `/api/health` endpoint (if created)
- Monitor Supabase dashboard for connection issues
- Check Stripe dashboard for webhook delivery status

### Key Metrics to Monitor
- Build time (should be < 2 minutes)
- Cold start time
- Error rate
- API response times
- Database query performance

## Troubleshooting

### Build Fails on Vercel
1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Ensure `package.json` lock file is committed
4. Test build locally: `npm run build`

### Environment Variable Issues
```bash
# List configured environment variables
vercel env ls

# Pull environment variables locally (for testing)
vercel env pull .env.local
```

### Database Connection Issues
- Verify Supabase project is active
- Check `NEXT_PUBLIC_SUPABASE_URL` matches project URL
- Ensure anon key is correct and not expired
- Review Supabase logs for connection errors

### Stripe Webhook Failures
- Verify webhook secret matches Stripe dashboard
- Check webhook endpoint URL is correct
- Review Stripe dashboard webhook logs
- Ensure webhook endpoint is not rate-limited

## Performance Optimization

### Next.js Build Optimization
- Enable Edge Runtime for API routes when possible
- Use ISR (Incremental Static Regeneration) for semi-static pages
- Implement proper caching headers
- Monitor bundle size with `@next/bundle-analyzer`

### Vercel Settings
- **Region:** iad1 (US East, closest to Supabase US region)
- **Functions:** Configured to serverless by default
- **Edge Network:** Automatically enabled for static assets

## Security Best Practices

### Environment Variables
- Never commit `.env.local` or `.env*.local` files
- Use Vercel's encrypted environment variables
- Rotate secrets regularly (Stripe keys, Supabase keys)
- Use different keys for preview vs production

### Deployment Security
- Enable Vercel deployment protection for preview deployments
- Require GitHub branch protection rules on main
- Use signed commits (optional but recommended)

## Contact & Escalation
- Primary: Check Vercel deployment logs
- Secondary: Review GitHub Actions workflow runs
- Tertiary: Contact Vercel support (for platform issues)

## Changelog
- 2026-02-11: Initial deployment runbook created
