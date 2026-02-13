// User Roles
export const USER_ROLES = ['super_admin', 'admin', 'client'] as const;
export type UserRole = typeof USER_ROLES[number];

// Client Status
export const CLIENT_STATUSES = ['active', 'inactive', 'lead'] as const;
export type ClientStatus = typeof CLIENT_STATUSES[number];

// Project Types
export const PROJECT_TYPES = [
  'corporate_video',
  'event_coverage',
  'social_media_content',
  'commercial',
  'documentary',
  'music_video',
  'other',
] as const;
export type ProjectType = typeof PROJECT_TYPES[number];

// Project Statuses (Kanban columns)
export const PROJECT_STATUSES = [
  'briefing',
  'pre_production',
  'filming',
  'editing',
  'review',
  'revisions',
  'delivered',
  'archived',
] as const;
export type ProjectStatus = typeof PROJECT_STATUSES[number];

// Priority
export const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export type Priority = typeof PRIORITIES[number];

// Task Statuses
export const TASK_STATUSES = ['todo', 'in_progress', 'review', 'done'] as const;
export type TaskStatus = typeof TASK_STATUSES[number];

// Deliverable Statuses
export const DELIVERABLE_STATUSES = [
  'pending_review',
  'approved',
  'revision_requested',
  'final',
] as const;
export type DeliverableStatus = typeof DELIVERABLE_STATUSES[number];

// Invoice Statuses
export const INVOICE_STATUSES = [
  'draft',
  'sent',
  'viewed',
  'paid',
  'overdue',
  'cancelled',
] as const;
export type InvoiceStatus = typeof INVOICE_STATUSES[number];

// Contract Statuses
export const CONTRACT_STATUSES = [
  'draft',
  'sent',
  'viewed',
  'signed',
  'expired',
  'cancelled',
] as const;
export type ContractStatus = typeof CONTRACT_STATUSES[number];

// Filming Request Statuses
export const FILMING_REQUEST_STATUSES = [
  'pending',
  'reviewed',
  'accepted',
  'declined',
  'converted',
] as const;
export type FilmingRequestStatus = typeof FILMING_REQUEST_STATUSES[number];

// Shot Types
export const SHOT_TYPES = [
  'wide',
  'medium',
  'close_up',
  'detail',
  'aerial',
  'pov',
  'tracking',
  'other',
] as const;
export type ShotType = typeof SHOT_TYPES[number];

// Expense Categories
export const EXPENSE_CATEGORIES = [
  'equipment',
  'travel',
  'location',
  'talent',
  'post_production',
  'software',
  'marketing',
  'other',
] as const;
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

// Greek VAT rate
export const DEFAULT_TAX_RATE = 24.0;
export const DEFAULT_CURRENCY = 'EUR';

// Invoice numbering prefix
export const INVOICE_PREFIX = 'DMS';

// Storage bucket names
export const STORAGE_BUCKETS = {
  avatars: 'avatars',
  deliverables: 'deliverables',
  attachments: 'attachments',
  receipts: 'receipts',
  contracts: 'contracts',
} as const;

// Max file sizes (in bytes)
export const MAX_FILE_SIZES = {
  avatar: 5 * 1024 * 1024, // 5MB
  deliverable: 5 * 1024 * 1024 * 1024, // 5GB
  attachment: 50 * 1024 * 1024, // 50MB
  receipt: 10 * 1024 * 1024, // 10MB
  contract: 10 * 1024 * 1024, // 10MB
} as const;

// Labels for display (bilingual where needed)
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  briefing: 'Briefing',
  pre_production: 'Pre-Production',
  filming: 'Filming',
  editing: 'Editing',
  review: 'Review',
  revisions: 'Revisions',
  delivered: 'Delivered',
  archived: 'Archived',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
};

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  viewed: 'Viewed',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
};

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  lead: 'Lead',
};

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  viewed: 'Viewed',
  signed: 'Signed',
  expired: 'Expired',
  cancelled: 'Cancelled',
};

export const DELIVERABLE_STATUS_LABELS: Record<DeliverableStatus, string> = {
  pending_review: 'Pending Review',
  approved: 'Approved',
  revision_requested: 'Revision Requested',
  final: 'Final',
};

export const FILMING_REQUEST_STATUS_LABELS: Record<
  FilmingRequestStatus,
  string
> = {
  pending: 'Pending',
  reviewed: 'Reviewed',
  accepted: 'Accepted',
  declined: 'Declined',
  converted: 'Converted',
};

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  corporate_video: 'Corporate Video',
  event_coverage: 'Event Coverage',
  social_media_content: 'Social Media Content',
  commercial: 'Commercial',
  documentary: 'Documentary',
  music_video: 'Music Video',
  other: 'Other',
};

export const SHOT_TYPE_LABELS: Record<ShotType, string> = {
  wide: 'Wide',
  medium: 'Medium',
  close_up: 'Close-Up',
  detail: 'Detail',
  aerial: 'Aerial',
  pov: 'POV',
  tracking: 'Tracking',
  other: 'Other',
};

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  equipment: 'Equipment',
  travel: 'Travel',
  location: 'Location',
  talent: 'Talent',
  post_production: 'Post-Production',
  software: 'Software',
  marketing: 'Marketing',
  other: 'Other',
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  client: 'Client',
};
