---
title: Contract PDF Redesign
status: approved
date: 2026-03-20
---

# Contract PDF Redesign — Design Spec

## Overview

Complete redesign of the contract system: new branded PDF template, embedded PDF preview in platform, new signing flow (download → sign offline → upload), and bilingual support.

## Problems Being Solved

1. **PDF looks unprofessional** — current blue/slate color scheme doesn't match the Devre Media brand
2. **PDF breaks across pages randomly** — content cuts mid-section with no control
3. **In-platform view is ugly** — raw HTML dump with `dangerouslySetInnerHTML` renders poorly
4. **No custom terms per contract** — only hardcoded generic terms
5. **Scope description is just a title** — no detailed description field
6. **Digital signature pad is limiting** — clients need to download, sign physically, and upload back
7. **English-only** — terms and labels not bilingual

## Design Decisions

### 1. PDF Visual Style — Dark Header/Footer + White Body + Gold Accents

**Brand palette (matching email templates):**
- Background dark: `#09090b` (zinc-950)
- Card dark: `#18181b` (zinc-900)
- Border dark: `#27272a` (zinc-800)
- Gold accent: `#d4a843`
- White: `#ffffff`
- Muted text: `#71717a`, `#a1a1aa`
- Body surface: `#fafafa`

**Logo:** Use `public/images/LOGO_WhiteLetter.png` (white on transparent) in the dark header. Read via `fs.readFileSync(path.join(process.cwd(), 'public', 'images', 'LOGO_WhiteLetter.png'))` and convert to base64 data URL. Cache in a module-level `const` (read once, not per request). The route must NOT use `export const runtime = 'edge'` — it requires Node.js `fs` access.

**Font — Greek glyph support:** The built-in Helvetica in react-pdf does NOT support Greek characters. Register a Greek-capable font (Noto Sans) via `Font.register()` at module scope in `contract-pdf-styles.ts`:

```ts
import { Font } from '@react-pdf/renderer';
import path from 'path';

Font.register({
  family: 'NotoSans',
  fonts: [
    { src: path.join(process.cwd(), 'public', 'fonts', 'NotoSans-Regular.ttf') },
    { src: path.join(process.cwd(), 'public', 'fonts', 'NotoSans-Bold.ttf'), fontWeight: 'bold' },
  ],
});
```

Place font files in `public/fonts/`. Use `fontFamily: 'NotoSans'` throughout the stylesheet.

**Structure:**
1. **Dark header** — Logo (left) + "ΣΥΜΒΑΣΗ ΠΑΡΟΧΗΣ ΥΠΗΡΕΣΙΩΝ / SERVICE AGREEMENT" (right) + contract ref
2. **Gold stripe** (2px gradient)
3. **Date row** — Agreement date + signature deadline
4. **Parties** — 2 cards side by side:
   - Provider: company name, ΑΦΜ, ΔΟΥ, address (from env vars)
   - Client: name, company, project title
5. **Scope of Services** — Detailed description (new textarea field)
6. **Financial Terms** — Amount + Payment Method cards with gold/dark top borders
7. **Ειδικοί Όροι / Special Terms** — Custom terms per contract (new textarea field)
8. **Γενικοί Όροι / General Terms** — Standard legal terms (bilingual el/en)
9. **Signatures** — Client + Provider side by side with signature lines
10. **Dark footer** — Ref number, page number (Σελ. X/Y), devremedia.com

### 2. Page Break Logic

- `wrap={false}` on Signatures section — never split across pages
- Each section is a self-contained `<View>` — react-pdf handles page breaks between sections
- Header repeats on every page via `fixed` prop
- Footer repeats on every page via `fixed` prop with page numbers using `render` prop for dynamic page numbers
- No forced single-page constraint — content flows naturally but never mid-section

### 3. Platform View — Embedded PDF Preview

Replace the current `ContractView` component (raw HTML dump) with:
- **Embedded PDF** using `<iframe src="/api/contracts/[id]/pdf?inline=true">` — the API route checks for `?inline=true` query param and returns `Content-Disposition: inline` instead of `attachment`
- **Metadata cards** below: client name, amount, deadline, status
- **Action buttons**: Download PDF (all statuses for admin, sent+ for client), Upload Signed PDF (client only, when status is `sent` or `viewed`)
- Remove `contract.content` HTML rendering entirely
- Admin can always download/preview any contract regardless of status

### 4. Signing Flow — Download → Sign → Upload

**Remove:**
- Digital signature pad (`SignaturePad` component)
- `/client/contracts/[id]/sign` page and all files in that directory
- `/api/contracts/[id]/sign` API route
- `signContract()` server action from `src/lib/actions/contracts.ts`
- `signContractSchema` from `src/lib/schemas/contract.ts`
- `signature_image`, `signature_data` fields from signing flow (keep columns in DB for old data)

**New flow:**
1. Client sees contract with embedded PDF preview
2. Client clicks "Download PDF" — gets the PDF
3. Client signs physically (print → sign → scan) or digitally offline
4. Client clicks "Upload Signed Contract" — uploads signed PDF
5. Signed PDF stored in Supabase Storage bucket `contracts`
6. Contract status changes to `pending_review`
7. Admin receives notification via `createNotificationForMany()` (all admins) — type: `CONTRACT_PENDING_REVIEW` (new notification type), title: "Signed contract uploaded", actionUrl: `/admin/contracts/[id]`
8. Admin reviews uploaded PDF and marks as `signed` or requests re-upload (status back to `sent`)

**New server action: `reviewSignedContract(id, decision)`**
- Located in `src/lib/actions/contracts.ts`
- Admin-only (role check: super_admin or admin)
- `decision: 'approve' | 'reject'`
- On approve: verify `signed_pdf_path IS NOT NULL`, set status to `signed`, set `signed_at` timestamp
- On reject: set status back to `sent`, notify client with type: `CONTRACT_UPLOAD_REJECTED` (new notification type), title: "Contract needs re-signing", actionUrl: `/client/contracts/[id]`
- Rejected uploads: the old signed PDF stays in storage — client re-uploads over the same path (overwrite is intentional, no admin delete needed)
- Revalidate relevant paths

**New notification types to add:**
- `CONTRACT_PENDING_REVIEW` — admin notification when client uploads signed PDF
- `CONTRACT_UPLOAD_REJECTED` — client notification when admin rejects uploaded PDF

**Contract statuses (update `CONTRACT_STATUSES` in constants):**
- `draft` — created, not sent
- `sent` — sent to client (or rejected re-upload, sent back)
- `viewed` — client opened it (optional)
- `pending_review` — client uploaded signed PDF, awaiting admin review
- `signed` — admin confirmed the signed PDF
- `expired` — past deadline (optional)
- `cancelled` — (existing, keep)

Must add `pending_review` to:
- `CONTRACT_STATUSES` array in `src/lib/constants.ts`
- `CONTRACT_STATUS_LABELS` in constants (el: "Αναμονή Ελέγχου", en: "Pending Review")
- Update `isContractSignable()` — returns `false` for `pending_review` (upload already done)

**Storage:**
- Bucket: `contracts` (private)
- Path: `signed/{contractId}/signed-contract.pdf`
- Re-upload overwrites the same path (intentional — only latest version matters, no admin delete policy needed)
- The storage path MUST be constructed entirely server-side as `` `signed/${contractId}/signed-contract.pdf` `` — no part of the path comes from the client request body
- RLS: client can upload to their own contract, admin can read all (see Migration section for SQL)

**Upload endpoint security (`/api/contracts/[contractId]/upload-signed/route.ts`):**
1. Auth check: `getUser()` — must be authenticated
2. Ownership check: verify user's `client_id` matches `contracts.client_id` (app-level check, not just RLS)
3. Status guard: only allow upload when status is `sent` or `viewed` — reject `pending_review`, `signed`, `expired`, `cancelled`
4. File type validation:
   - Check `Content-Type` is `application/pdf`
   - Check first 5 bytes are `%PDF-` (magic bytes validation — do NOT trust Content-Type alone)
   - Max file size: 10 MB
5. Construct storage path server-side: `signed/${contractId}/signed-contract.pdf`
6. Upload to Supabase Storage (upsert mode to allow re-uploads)
7. Update contract: `signed_pdf_path`, status → `pending_review`
8. Notify admins via `createNotificationForMany()` with type `CONTRACT_PENDING_REVIEW`

### 5. Form Changes (Contract Creator)

**New fields:**
- `scope_description` (textarea) — detailed description of services
- `special_terms` (textarea) — custom terms per contract

**These replace the auto-generated HTML content.** Explicitly remove the `generateContractContent()` function AND its call inside `createContract()`. New contracts set `content` to empty string `''` in the DB insert.

### 6. Database Changes

**New columns on `contracts` table:**
- `scope_description` (text, nullable) — detailed scope
- `special_terms` (text, nullable) — custom terms per contract
- `signed_pdf_path` (text, nullable) — path to uploaded signed PDF in storage

**`content` column:** `ALTER COLUMN content SET DEFAULT ''` — keep NOT NULL, default to empty string for new contracts. Existing contracts retain their HTML content (unused but preserved).

**Update all `.select()` column lists in `contracts.ts`:** Every hardcoded `.select()` string that enumerates contract columns must include `scope_description`, `special_terms`, `signed_pdf_path`. There are ~6 such calls in the file — update all of them.

**Storage bucket and RLS policies:**

Use a `SECURITY DEFINER` helper function to avoid repeated cross-table subqueries in RLS hot path:

```sql
-- Helper function for contract ownership check
CREATE OR REPLACE FUNCTION get_user_contract_ids(user_uuid uuid)
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT ct.id FROM contracts ct
  JOIN clients c ON c.id = ct.client_id
  WHERE c.user_id = user_uuid;
$$;

-- Create contracts storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('contracts', 'contracts', false);

-- Clients can upload signed PDFs for their own contracts
CREATE POLICY "Clients upload signed contracts"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'contracts'
  AND (
    SELECT EXISTS (
      SELECT 1 FROM get_user_contract_ids(auth.uid()) cid
      WHERE name LIKE 'signed/' || cid || '/%'
    )
  )
);

-- Clients can view their own signed PDFs
CREATE POLICY "Clients view own signed contracts"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'contracts'
  AND (
    SELECT EXISTS (
      SELECT 1 FROM get_user_contract_ids(auth.uid()) cid
      WHERE name LIKE 'signed/' || cid || '/%'
    )
  )
);

-- Admins can read all contract files
CREATE POLICY "Admins read all contracts"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'contracts'
  AND EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() AND up.role IN ('admin', 'super_admin')
  )
);
```

### 7. Provider Details — Environment Variables

```env
PROVIDER_COMPANY_NAME="ΝΤΕΒΡΕΝΤΛΗΣ ΑΓΓΕΛΟΣ ΝΙΚΟΛΑΟΣ"
PROVIDER_VAT_NUMBER="160594763"
PROVIDER_PROFESSION="ΥΠΗΡΕΣΙΕΣ ΦΩΤΟΓΡΑΦΙΣΗΣ ΚΑΙ ΒΙΝΤΕΟΣΚΟΠΗΣΗΣ"
PROVIDER_TAX_OFFICE="ΚΑΛΑΜΑΡΙΑΣ"
PROVIDER_ADDRESS="ΣΟΦΟΥΛΗ ΘΕΜΙΣΤΟΚΛΗ 88, ΚΑΛΑΜΑΡΙΑ"
```

Read in the PDF API route at render time. Not hardcoded in source.

### 8. Bilingual Support (el/en)

**PDF locale: stored per contract, not from viewer cookie.** When a contract is created, the admin's current `NEXT_LOCALE` is stored in a new `locale` column on the contract (default: `'el'`). The PDF API route reads this stored locale to generate the PDF — this ensures the contract language stays consistent regardless of who views/downloads it (admin or client).

**PDF translations live in a plain lookup object** (not next-intl) inside a dedicated `src/lib/pdf/contract-pdf-i18n.ts` file:

```ts
export const PDF_TRANSLATIONS = {
  el: {
    serviceAgreement: 'ΣΥΜΒΑΣΗ ΠΑΡΟΧΗΣ ΥΠΗΡΕΣΙΩΝ',
    parties: 'ΣΥΜΒΑΛΛΟΜΕΝΑ ΜΕΡΗ',
    provider: 'ΠΑΡΟΧΟΣ ΥΠΗΡΕΣΙΩΝ',
    client: 'ΠΕΛΑΤΗΣ',
    scopeOfServices: 'ΑΝΤΙΚΕΙΜΕΝΟ ΥΠΗΡΕΣΙΩΝ',
    financialTerms: 'ΟΙΚΟΝΟΜΙΚΟΙ ΟΡΟΙ',
    totalAmount: 'ΣΥΝΟΛΙΚΟ ΠΟΣΟ',
    paymentMethod: 'ΤΡΟΠΟΣ ΠΛΗΡΩΜΗΣ',
    specialTerms: 'ΕΙΔΙΚΟΙ ΟΡΟΙ',
    generalTerms: 'ΓΕΝΙΚΟΙ ΟΡΟΙ',
    signatures: 'ΥΠΟΓΡΑΦΕΣ',
    agreementDate: 'ΗΜΕΡΟΜΗΝΙΑ',
    signatureDeadline: 'ΠΡΟΘΕΣΜΙΑ ΥΠΟΓΡΑΦΗΣ',
    legallyBinding: 'Νομικά δεσμευτικό έγγραφο',
    page: 'Σελ.',
    terms: [
      'Ο πάροχος δεσμεύεται να παραδώσει τις υπηρεσίες εντός του συμφωνημένου χρονοδιαγράμματος.',
      'Η πληρωμή οφείλεται σύμφωνα με τους συμφωνημένους όρους. Καθυστερήσεις πληρωμής μπορεί να επιφέρουν πρόσθετες χρεώσεις.',
      'Αιτήματα αναθεώρησης πρέπει να κοινοποιηθούν εντός 7 ημερών από την τελική παράδοση.',
      'Με την πλήρη εξόφληση, ο Πελάτης λαμβάνει άδεια χρήσης των τελικών παραδοτέων. Ο Πάροχος διατηρεί το δικαίωμα χρήσης στο portfolio του.',
      'Οποιοδήποτε μέρος μπορεί να ακυρώσει με γραπτή ειδοποίηση. Οι προκαταβολές δεν επιστρέφονται εκτός αν συμφωνηθεί διαφορετικά.',
      'Η ευθύνη του Παρόχου περιορίζεται στο συνολικό ποσό που καταβλήθηκε.',
      'Η παρούσα Σύμβαση αποτελεί την πλήρη συμφωνία μεταξύ των μερών.',
    ],
  },
  en: {
    serviceAgreement: 'SERVICE AGREEMENT',
    parties: 'PARTIES',
    provider: 'SERVICE PROVIDER',
    client: 'CLIENT',
    scopeOfServices: 'SCOPE OF SERVICES',
    financialTerms: 'FINANCIAL TERMS',
    totalAmount: 'TOTAL AMOUNT',
    paymentMethod: 'PAYMENT METHOD',
    specialTerms: 'SPECIAL TERMS',
    generalTerms: 'GENERAL TERMS',
    signatures: 'SIGNATURES',
    agreementDate: 'AGREEMENT DATE',
    signatureDeadline: 'SIGNATURE DEADLINE',
    legallyBinding: 'Legally binding document',
    page: 'Page',
    terms: [
      'The service provider agrees to deliver the services described above within the agreed timeline.',
      'Payment is due according to the agreed payment terms. Late payments may incur additional fees.',
      'Client revision requests must be communicated within 7 days of final delivery.',
      'Upon receipt of full payment, the Client receives a license to use the final deliverables. Provider retains the right to use the work in their portfolio.',
      'Either party may cancel with written notice. Advance payments are non-refundable unless otherwise agreed.',
      "Provider's liability is limited to the total amount paid under this Agreement.",
      'This Agreement constitutes the entire understanding between the parties.',
    ],
  },
} as const;
```

**UI translations** (buttons, labels, toasts) added to `messages/el.json` and `messages/en.json` under `contracts.*` namespace as usual.

### 9. Backwards Compatibility

**Existing contracts:** The PDF template uses a fallback chain for scope (using `||` for truthiness, not just `??` for null — so empty strings also fall through):
- `scope_description || service_type || title`

If `scope_description` is null or empty (old contracts), falls back to existing behavior.

**Existing `content` field:** Remains in DB, not rendered. New contracts store `''`.

**Existing `signature_data` / `signature_image`:** Fields remain in DB for already-signed contracts. The PDF template continues to render `signature_image` if present (backwards compat for old signed contracts).

## Files Affected

### Modified:
- `src/lib/pdf/contract-template.tsx` — complete rewrite with new design, Noto Sans font, logo, bilingual labels
- `src/lib/pdf/contract-pdf-styles.ts` — new brand palette (#09090b, #d4a843 gold), Font.register() for Noto Sans
- `src/app/api/contracts/[contractId]/pdf/route.ts` — add provider env vars, locale from contract.locale field, `?inline=true` query param support, logo base64 caching. Must NOT use `export const runtime = 'edge'`
- `src/lib/actions/contracts.ts` — update createContract (scope_description, special_terms, locale, content=''), explicitly remove `generateContractContent()` function and its call, remove `signContract()` action, add `reviewSignedContract()` action, update all `.select()` column lists to include new fields (scope_description, special_terms, signed_pdf_path, locale)
- `src/lib/schemas/contract.ts` — add scope_description, special_terms to createContractSchema, remove signContractSchema, add uploadSignedSchema (PDF file validation)
- `src/components/shared/contract-view.tsx` — replace HTML dump with embedded PDF iframe + metadata cards
- `src/app/admin/contracts/[contractId]/contract-view-page.tsx` — Download PDF for all statuses, add approve/reject buttons for pending_review
- `src/app/client/contracts/[contractId]/contract-view-client.tsx` — add upload button, remove sign page link
- `src/components/admin/contracts/contract-creator.tsx` — add scope_description + special_terms textareas
- `messages/el.json` — add contract PDF + UI translation keys (upload, review, pending_review status, etc.)
- `messages/en.json` — add contract PDF + UI translation keys
- `src/lib/constants.ts` — add `pending_review` to CONTRACT_STATUSES, CONTRACT_STATUS_LABELS, update isContractSignable()
- `src/types/index.ts` — add `scope_description`, `special_terms`, `signed_pdf_path`, `locale` to Contract type

### New:
- `src/lib/pdf/contract-pdf-i18n.ts` — PDF translation lookup object (el/en)
- `src/app/api/contracts/[contractId]/upload-signed/route.ts` — signed PDF upload endpoint with validation
- `supabase/migrations/XXXX_contract_redesign.sql` — new columns (scope_description, special_terms, signed_pdf_path, locale) + content default + storage bucket + SECURITY DEFINER helper + RLS policies
- `.env.local` — add PROVIDER_* env vars
- `public/fonts/NotoSans-Regular.ttf` — Greek-capable font for PDF
- `public/fonts/NotoSans-Bold.ttf` — Greek-capable font bold for PDF

### Removed:
- `src/app/client/contracts/[contractId]/sign/` — entire sign page directory
- `src/app/api/contracts/[contractId]/sign/route.ts` — sign API route
- `src/components/shared/signature-pad.tsx` — digital signature pad component
- `signContract()` action from `src/lib/actions/contracts.ts`
- `signContractSchema` from `src/lib/schemas/contract.ts`

## Out of Scope

- Contract templates CRUD (existing but unused — leave as-is)
- E-signature service integration (DocuSign, etc.)
- Expiry enforcement on upload (separate task — but upload endpoint does check status)
- Viewed tracking (separate task)
