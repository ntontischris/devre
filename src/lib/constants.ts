// User Roles
export const USER_ROLES = ['super_admin', 'admin', 'client', 'employee', 'salesman'] as const;
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
  'podcast',
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
  podcast: 'Podcast',
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
  employee: 'Employee',
  salesman: 'Salesman',
};

// Lead Stages (CRM pipeline)
export const LEAD_STAGES = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'negotiation',
  'won',
  'lost',
] as const;
export type LeadStage = typeof LEAD_STAGES[number];

export const LEAD_STAGE_LABELS: Record<LeadStage, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
};

// Lead Sources
export const LEAD_SOURCES = [
  'referral',
  'website',
  'social_media',
  'cold_call',
  'event',
  'advertisement',
  'other',
] as const;
export type LeadSource = typeof LEAD_SOURCES[number];

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  referral: 'Referral',
  website: 'Website',
  social_media: 'Social Media',
  cold_call: 'Cold Call',
  event: 'Event',
  advertisement: 'Advertisement',
  other: 'Other',
};

// Lead Activity Types
export const LEAD_ACTIVITY_TYPES = [
  'call',
  'email',
  'meeting',
  'note',
  'stage_change',
  'other',
] as const;
export type LeadActivityType = typeof LEAD_ACTIVITY_TYPES[number];

export const LEAD_ACTIVITY_TYPE_LABELS: Record<LeadActivityType, string> = {
  call: 'Call',
  email: 'Email',
  meeting: 'Meeting',
  note: 'Note',
  stage_change: 'Stage Change',
  other: 'Other',
};

// Equipment Catalog (Devre Media inventory)
export const EQUIPMENT_CATEGORIES = [
  'camera',
  'microphone',
  'drone',
  'gimbal',
  'lights',
  'tripod',
  'computer',
  'storage',
] as const;
export type EquipmentCategory = typeof EQUIPMENT_CATEGORIES[number];

export const EQUIPMENT_CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  camera: 'Κάμερα',
  microphone: 'Μικρόφωνο',
  drone: 'Drone',
  gimbal: 'Gimbal',
  lights: 'Φώτα',
  tripod: 'Τρίποδα',
  computer: 'Υπολογιστής',
  storage: 'Σκληροί Δίσκοι',
};

export interface CatalogEquipmentItem {
  name: string;
  category: EquipmentCategory;
  description: string;
}

export const EQUIPMENT_CATALOG: CatalogEquipmentItem[] = [
  // Cameras
  { name: 'iPhone 17 Pro Max 1TB', category: 'camera', description: 'Main camera' },
  { name: 'iPhone 16 Pro Max 1TB', category: 'camera', description: 'Secondary camera' },
  { name: 'Insta 360 X5', category: 'camera', description: 'Action Camera' },
  // Microphones
  { name: 'DJI Mic 2', category: 'microphone', description: 'Διπλό μικρόφωνο' },
  { name: 'DJI Mic 1', category: 'microphone', description: 'Μονό μικρόφωνο' },
  // Drone
  { name: 'DJI Mini 4 Pro', category: 'drone', description: 'Drone' },
  // Gimbal
  { name: 'DJI Osmo Mobile 6', category: 'gimbal', description: 'Σταθεροποιητής πλάνων' },
  // Lights
  { name: 'GODOX', category: 'lights', description: 'Main light' },
  { name: 'DIGIPOWER RGB Led', category: 'lights', description: 'RGB Led Video Light' },
  // Tripods
  { name: 'Απλό Τρίποδο (1)', category: 'tripod', description: 'Για κινητό' },
  { name: 'Απλό Τρίποδο (2)', category: 'tripod', description: 'Για κινητό' },
  { name: 'Επιτραπέζιο Τρίποδο', category: 'tripod', description: 'Για κινητό' },
  // Computer
  { name: 'MacBook M3 Pro', category: 'computer', description: 'Laptop' },
  // Storage
  { name: 'Corsair 1TB SSD', category: 'storage', description: 'Αποθήκευση' },
  { name: 'Intenso 5TB HDD', category: 'storage', description: 'Κεντρικό BackUp' },
  { name: 'OneDrive 1TB SSD', category: 'storage', description: 'Αποθήκευση' },
  { name: 'Intenso 1TB SSD', category: 'storage', description: 'Αποθήκευση' },
];

// ============================================================
// SERVICE PACKAGES & PRICING
// ============================================================

export interface ServicePackage {
  id: string;
  name: string;
  deliverables: string;
  includes: string;
  price: number;
  priceWithScripts?: number;
  hasPrePayDiscount: boolean;
  deliveryTime: string;
  contractDuration?: string;
  notes?: string;
}

export interface ServiceCategory {
  projectType: ProjectType;
  label: string;
  description: string;
  packages: ServicePackage[];
  perCasePricing?: {
    items: Array<{ label: string; price: string }>;
    deliveryTime: string;
    fastDeliveryFee?: number;
    includes?: string;
    note?: string;
  };
  cancellationPolicy: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  // ── Social Media Content ──────────────────────────────────
  {
    projectType: 'social_media_content',
    label: 'Social Media Content',
    description: 'Short-form content for social platforms',
    cancellationPolicy:
      'Αλλαγή ημερομηνίας > 7 ημέρες πριν: δωρεάν, ανάλογα με διαθεσιμότητα. Αλλαγή / ακύρωση < 7 ημέρες πριν: τέλος 150\u20AC ανά ημέρα γυρίσματος.',
    packages: [
      {
        id: 'social_a',
        name: 'Πακέτο Α',
        deliverables: '8 video / μήνα',
        includes: '2 ημέρες γυρισμάτων, 1 κύκλο αλλαγών / video',
        price: 1170,
        priceWithScripts: 1404,
        hasPrePayDiscount: true,
        deliveryTime: '7 εργάσιμες από το κάθε γύρισμα',
        contractDuration: '6 μήνες συμβόλαιο',
      },
      {
        id: 'social_b',
        name: 'Πακέτο Β',
        deliverables: '12 video / μήνα',
        includes: '2 ημέρες γυρισμάτων, 1 κύκλο αλλαγών / video',
        price: 1350,
        priceWithScripts: 1620,
        hasPrePayDiscount: true,
        deliveryTime: '7 εργάσιμες από το κάθε γύρισμα',
        contractDuration: '6 μήνες συμβόλαιο',
      },
      {
        id: 'social_c',
        name: 'Πακέτο Γ',
        deliverables: '20 video / μήνα',
        includes: '3 ημέρες γυρισμάτων, 1 κύκλο αλλαγών / video',
        price: 2220,
        priceWithScripts: 2664,
        hasPrePayDiscount: true,
        deliveryTime: '7 εργάσιμες από το κάθε γύρισμα',
        contractDuration: '6 μήνες συμβόλαιο',
      },
    ],
  },

  // ── Corporate Video (Εταιρικά Video) ──────────────────────
  {
    projectType: 'corporate_video',
    label: 'Εταιρικά Video',
    description:
      'Εταιρικά video, video εταιρικής ευθύνης, ετήσια video. Κοστολόγηση ανά περίπτωση.',
    cancellationPolicy:
      'Αλλαγή ημερομηνίας > 7 ημέρες πριν: δωρεάν, ανάλογα με διαθεσιμότητα. Αλλαγή / ακύρωση < 7 ημέρες πριν: τέλος 150\u20AC ανά ημέρα γυρίσματος.',
    packages: [],
    perCasePricing: {
      items: [
        { label: 'Ημέρα γυρίσματος', price: '500\u20AC' },
        { label: 'Video έως 2 λεπτά', price: '1.000\u20AC' },
        { label: 'Reel', price: '150\u20AC' },
        { label: 'Εξοπλισμός / ημέρα', price: '200\u20AC' },
        { label: 'Μετακινήσεις & έξοδα', price: 'Επιπλέον' },
      ],
      deliveryTime: '14 εργάσιμες',
      fastDeliveryFee: 350,
      includes:
        'Γύρισμα με 2 κάμερες, χρήση drone, μικροφώνου, πλήρη edit και έναν κύκλο αλλαγών',
      note:
        'Αν το video περιλαμβάνει πάνω από 2 τοποθεσίες χρειάζονται τουλάχιστον 2 μέρες γυρισμάτων. Αν περιλαμβάνει συνεντεύξεις προστίθεται μία ακόμη μέρα.',
    },
  },

  // ── Content on the Spot — Event Coverage ──────────────────
  {
    projectType: 'event_coverage',
    label: 'Content on the Spot — Κάλυψη Event',
    description:
      'Γύρισμα και edit επιτόπου. Ιδανικό για εγκαίνια, συνέδρια, εταιρικά events.',
    cancellationPolicy:
      'Η προκαταβολή δεν επιστρέφεται σε περίπτωση ακύρωσης. Μεταφορά σε άλλη ημερομηνία μόνο κατόπιν συνεννόησης & διαθεσιμότητας.',
    packages: [
      {
        id: 'event_a',
        name: 'Πακέτο Α',
        deliverables: '3 video',
        includes: 'Γύρισμα και edit on the spot',
        price: 650,
        hasPrePayDiscount: false,
        deliveryTime: 'Παράδοση επιτόπου',
        notes: 'Ιδανικό για εγκαίνια, συνέδρια, γάμους',
      },
      {
        id: 'event_b',
        name: 'Πακέτο Β',
        deliverables: '5 video',
        includes: 'Γύρισμα και edit on the spot',
        price: 850,
        hasPrePayDiscount: false,
        deliveryTime: 'Παράδοση επιτόπου',
      },
    ],
  },

  // ── Podcasts ──────────────────────────────────────────────
  {
    projectType: 'podcast',
    label: 'Podcasts',
    description: 'Επαγγελματική παραγωγή podcast με 3 κάμερες και πλήρες μοντάζ.',
    cancellationPolicy:
      'Αλλαγή ημερομηνίας > 7 ημέρες πριν: δωρεάν, ανάλογα με διαθεσιμότητα. Αλλαγή / ακύρωση < 7 ημέρες πριν: τέλος 150\u20AC ανά ημέρα γυρίσματος.',
    packages: [
      {
        id: 'podcast_a',
        name: 'Πακέτο Α',
        deliverables: '2 επεισόδια / μήνα',
        includes:
          '1 μέρα γυρισμάτων, γύρισμα με 3 κάμερες, full μοντάζ επεισοδίων',
        price: 800,
        hasPrePayDiscount: true,
        deliveryTime: '7 εργάσιμες από το κάθε γύρισμα',
        contractDuration: '6 μήνες συμβόλαιο',
      },
      {
        id: 'podcast_b',
        name: 'Πακέτο Β',
        deliverables: '4 επεισόδια / μήνα',
        includes:
          '2 μέρες γυρισμάτων, γύρισμα με 3 κάμερες, full μοντάζ επεισοδίων',
        price: 1200,
        hasPrePayDiscount: true,
        deliveryTime: '7 εργάσιμες από το κάθε γύρισμα',
        contractDuration: '6 μήνες συμβόλαιο',
      },
      {
        id: 'podcast_c',
        name: 'Πακέτο Γ',
        deliverables: '6 επεισόδια / μήνα',
        includes:
          '3 μέρες γυρισμάτων, γύρισμα με 3 κάμερες, full μοντάζ επεισοδίων',
        price: 1500,
        hasPrePayDiscount: true,
        deliveryTime: '7 εργάσιμες από το κάθε γύρισμα',
        contractDuration: '6 μήνες συμβόλαιο',
      },
    ],
  },

  // ── Custom Request ────────────────────────────────────────
  {
    projectType: 'other',
    label: 'Custom Request',
    description:
      'Μεγαλύτερες παραγωγές, διαφημιστικά, ή οτιδήποτε δεν καλύπτεται από τα υπόλοιπα πακέτα. Θα σας στείλουμε προσφορά.',
    cancellationPolicy: 'Κατόπιν συνεννόησης.',
    packages: [],
  },
];

/**
 * Helper: find the service category for a given project type.
 * Returns undefined for types without a dedicated service category
 * (e.g. commercial, documentary, music_video).
 */
export function getServiceCategory(
  projectType: ProjectType,
): ServiceCategory | undefined {
  return SERVICE_CATEGORIES.find((c) => c.projectType === projectType);
}

// Knowledge Base Article Statuses
export const KB_ARTICLE_STATUSES = ['draft', 'published'] as const;
export type KbArticleStatus = typeof KB_ARTICLE_STATUSES[number];

export const KB_ARTICLE_STATUS_LABELS: Record<KbArticleStatus, string> = {
  draft: 'Draft',
  published: 'Published',
};
