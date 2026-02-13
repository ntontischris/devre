# Client User Guide

This guide covers all features available to client users in the Devre Media System portal.

---

## Getting Started

You will receive an email invitation from the Devre Media team with a link to create your account. Click the link, set your password, and complete a brief onboarding step. Once logged in, you will be taken to your client dashboard.

---

## Client Dashboard

**Route:** `/client/dashboard`

Your dashboard provides an overview of your current activity:

- **Active Projects** -- Cards showing your ongoing projects with status and progress
- **Pending Actions** -- Items that need your attention:
  - Videos awaiting your review
  - Invoices awaiting payment
  - Contracts awaiting your signature
- **Recent Messages** -- Latest messages from the production team

Click on any item to navigate directly to it.

---

## Viewing Projects

**Route:** `/client/projects`

The projects page lists all your projects. Click on a project to see its details.

**Route:** `/client/projects/[projectId]`

The project detail page shows:
- **Status** -- Current stage in the production workflow (briefing, pre-production, filming, editing, review, revisions, delivered, archived)
- **Timeline** -- Start date and deadline
- **Description** -- Project scope and details
- **Deliverables** -- Video files ready for your review
- **Messages** -- Direct communication thread with the team
- **Contracts** -- Any contracts associated with this project

---

## Reviewing Videos

**Route:** `/client/projects/[projectId]/deliverables`

When video deliverables are uploaded for your review, you can:

1. **Watch the video** -- Click on a deliverable to open the video player
2. **Add annotations** -- While watching, pause at any point and click "Add Annotation" to leave a timestamped note. Annotations appear as markers on the video timeline and help the production team understand exactly what you are referring to.
3. **Approve** -- If you are satisfied with the deliverable, click "Approve" to mark it as approved
4. **Request Revisions** -- If changes are needed, click "Request Revision" and include notes describing the desired changes

The production team will see your annotations and revision notes, make the changes, and upload a new version for you to review.

---

## Viewing and Paying Invoices

**Route:** `/client/invoices`

The invoices page lists all your invoices with their status and amounts.

### Invoice Detail

**Route:** `/client/invoices/[invoiceId]`

View the full invoice with line items, subtotal, VAT (24%), and total amount. The invoice shows:
- Invoice number (DMS-YYYY-XXX format)
- Issue date and due date
- Line item descriptions, quantities, and prices
- Payment status

### Paying with Stripe

For invoices with status "sent", click "Pay Now" to be redirected to Stripe Checkout. You can pay securely with a credit or debit card.

**Route:** `/client/invoices/[invoiceId]/success` -- Confirmation page shown after successful payment.

**Route:** `/client/invoices/[invoiceId]/cancel` -- Shown if you cancel the payment process. You can return later to complete payment.

Once payment is processed, the invoice status updates to "paid" automatically.

---

## Signing Contracts

**Route:** `/client/projects/[projectId]/contracts/[contractId]/sign`

When a contract is sent to you for signature:

1. **Review** -- Read the full contract content
2. **Sign** -- Use the signature pad to draw your signature
3. **Confirm** -- Enter your full name and submit

The system records your signature, name, IP address, and timestamp for legal validity. Once signed, you can download a PDF copy of the signed contract.

You will see a notification on your dashboard when contracts are awaiting your signature.

---

## Submitting Filming Requests

**Route:** `/client/book`

Submit a new filming request to the production team:

1. **Title** -- Brief description of the filming need
2. **Description** -- Detailed explanation of what you need filmed
3. **Preferred Date** -- Your preferred filming date
4. **Preferred Time** -- Morning, afternoon, or evening
5. **Location** -- Where the filming should take place
6. **Type** -- Category of filming (wedding, corporate, event, etc.)

After submission, the request status will be "pending" until the admin team reviews it. You will be notified when the request is approved or rejected. If rejected, the team will include a reason.

---

## Messaging

**Route:** `/client/projects/[projectId]/messages`

Each project has a dedicated message thread for communicating with the production team.

- **Send messages** -- Type your message and press send
- **Attach files** -- Click the attachment icon to upload files
- **Real-time** -- Messages appear instantly without refreshing the page
- **Read receipts** -- You can see when the team has read your messages

You will also receive email notifications for new messages if notifications are enabled in your settings.

---

## Profile Settings

**Route:** `/client/settings`

Update your personal information:
- Display name
- Avatar/profile picture
- Email (used for notifications)
- Password change

Notification preferences can also be configured here to control which email notifications you receive.
