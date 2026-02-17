/**
 * Type definitions for all DMS entities based on PRD database schema
 * These types will be replaced by Supabase-generated types once the database is set up
 */

import type {
  UserRole,
  ClientStatus,
  ProjectType,
  ProjectStatus,
  Priority,
  TaskStatus,
  DeliverableStatus,
  InvoiceStatus,
  ContractStatus,
  FilmingRequestStatus,
  ShotType,
  ExpenseCategory,
  LeadStage,
  LeadSource,
  LeadActivityType,
  KbArticleStatus,
} from '@/lib/constants';

// Re-export constant types for use in components
export type {
  UserRole,
  ClientStatus,
  ProjectType,
  ProjectStatus,
  Priority,
  TaskStatus,
  DeliverableStatus,
  InvoiceStatus,
  ContractStatus,
  FilmingRequestStatus,
  ShotType,
  ExpenseCategory,
  LeadStage,
  LeadSource,
  LeadActivityType,
  KbArticleStatus,
};

/**
 * Generic action result type for server actions and API responses
 */
export type ActionResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };

/**
 * User Profile
 * Extends auth.users with DMS-specific profile data
 */
export type UserProfile = {
  id: string;
  role: UserRole;
  display_name: string | null;
  avatar_url: string | null;
  preferences: Record<string, unknown>;
  created_at: string;
};

/**
 * Client
 * Represents a client company or individual
 */
export type Client = {
  id: string;
  user_id: string | null;
  company_name: string | null;
  contact_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  vat_number: string | null;
  avatar_url: string | null;
  notes: string | null;
  status: ClientStatus;
  created_at: string;
  updated_at: string;
};

/**
 * Project
 * Core entity representing a video production project
 */
export type Project = {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  project_type: ProjectType;
  status: ProjectStatus;
  priority: Priority;
  budget: number | null;
  deadline: string | null;
  start_date: string | null;
  completion_date: string | null;
  tags: string[];
  metadata: Record<string, unknown>;
  created_by: string;
  created_at: string;
  updated_at: string;
};

/**
 * Task
 * Represents a task within a project
 */
export type Task = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  assigned_to: string | null;
  due_date: string | null;
  sort_order: number;
  created_at: string;
};

/**
 * Deliverable
 * Represents a video file or asset delivered to the client
 */
export type Deliverable = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_size: number;
  file_type: string;
  version: number;
  status: DeliverableStatus;
  uploaded_by: string;
  download_count: number;
  expires_at: string | null;
  created_at: string;
};

/**
 * Video Annotation
 * Represents a timestamped comment/annotation on a deliverable
 */
export type VideoAnnotation = {
  id: string;
  deliverable_id: string;
  user_id: string;
  timecode: number;
  comment: string;
  position_x: number | null;
  position_y: number | null;
  resolved: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * Invoice Line Item
 * Embedded type for invoice line items (stored as JSONB)
 */
export type InvoiceLineItem = {
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  amount: number;
};

/**
 * Invoice
 * Represents an invoice for a project
 */
export type Invoice = {
  id: string;
  project_id: string;
  client_id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  status: InvoiceStatus;
  subtotal: number;
  tax_amount: number;
  total: number;
  currency: string;
  line_items: InvoiceLineItem[];
  notes: string | null;
  terms: string | null;
  sent_at: string | null;
  viewed_at: string | null;
  paid_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

/**
 * Expense
 * Represents a project-related expense
 */
export type Expense = {
  id: string;
  project_id: string | null;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  receipt_path: string | null;
  created_at: string;
};

/**
 * Message Attachment
 * Embedded type for message attachments (stored as JSONB)
 */
export type MessageAttachment = {
  file_url: string;
  file_name: string;
  file_size: number;
  mime_type: string;
};

/**
 * Message
 * Represents a message in a project thread
 */
export type Message = {
  id: string;
  project_id: string;
  sender_id: string;
  content: string;
  attachments: MessageAttachment[];
  read_by: string[];
  created_at: string;
};

/**
 * Contract
 * Represents a contract associated with a project
 */
export type Contract = {
  id: string;
  project_id: string | null;
  client_id: string;
  template_id: string | null;
  title: string;
  content: string;
  status: ContractStatus;
  pdf_path: string | null;
  signature_data: Record<string, unknown> | null;
  sent_at: string | null;
  viewed_at: string | null;
  signed_at: string | null;
  expires_at: string | null;
  created_by: string;
  created_at: string;
};

/**
 * Contract Template
 * Represents a reusable contract template
 */
export type ContractTemplate = {
  id: string;
  title: string;
  content: string;
  placeholders: Record<string, unknown>;
  created_by: string;
  created_at: string;
};

/**
 * Filming Request
 * Represents an inbound request from the public form
 */
export type FilmingRequest = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  project_type: ProjectType;
  description: string;
  budget_range: string | null;
  preferred_dates: string | null;
  status: FilmingRequestStatus;
  notes: string | null;
  converted_to_project_id: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Equipment Item
 * Embedded type for equipment list items (stored as JSONB)
 */
export type EquipmentItem = {
  name: string;
  quantity: number;
  notes: string | null;
};

/**
 * Equipment List
 * Represents an equipment checklist for a project
 */
export type EquipmentList = {
  id: string;
  project_id: string;
  title: string;
  items: EquipmentItem[];
  created_by: string;
  created_at: string;
  updated_at: string;
};

/**
 * Shot
 * Embedded type for individual shots (stored as JSONB)
 */
export type Shot = {
  shot_number: string;
  shot_type: ShotType;
  description: string;
  duration: number | null;
  notes: string | null;
  completed: boolean;
};

/**
 * Shot List
 * Represents a shot list for a project
 */
export type ShotList = {
  id: string;
  project_id: string;
  title: string;
  shots: Shot[];
  created_by: string;
  created_at: string;
  updated_at: string;
};

/**
 * Concept Note
 * Represents a creative concept document for a project
 */
export type ConceptNote = {
  id: string;
  project_id: string;
  title: string;
  content: string;
  version: number;
  created_by: string;
  created_at: string;
  updated_at: string;
};

/**
 * Activity Log
 * Represents an audit trail entry for entity changes
 */
export type ActivityLog = {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  user_id: string;
  changes: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

/**
 * Notification
 * Represents a user notification
 */
export type Notification = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  read_at: string | null;
  created_at: string;
};

/**
 * Extended types with relations (for joined queries)
 */
export type ProjectWithClient = Project & {
  client: Client;
};

export type ProjectWithRelations = Project & {
  client: Client;
  tasks: Task[];
  deliverables: Deliverable[];
};

export type TaskWithAssignee = Task & {
  assigned_user: UserProfile | null;
};

export type DeliverableWithAnnotations = Deliverable & {
  annotations: VideoAnnotation[];
};

export type MessageWithUser = Message & {
  user: UserProfile;
};

export type InvoiceWithRelations = Invoice & {
  client: Client;
  project: Project;
  tax_rate?: number;
};

export type ContractWithRelations = Contract & {
  client: Client;
  project: Project | null;
};

export type FilmingRequestWithProject = FilmingRequest & {
  converted_project: Project | null;
};

export type ActivityLogWithUser = ActivityLog & {
  user: UserProfile;
};

/**
 * Form input types (for creating/updating entities)
 */
export type CreateClientInput = Omit<
  Client,
  'id' | 'created_at' | 'updated_at'
>;

export type UpdateClientInput = Partial<CreateClientInput>;

export type CreateProjectInput = Omit<
  Project,
  'id' | 'created_at' | 'updated_at' | 'created_by'
>;

export type UpdateProjectInput = Partial<CreateProjectInput>;

export type CreateTaskInput = Omit<
  Task,
  'id' | 'created_at'
>;

export type UpdateTaskInput = Partial<CreateTaskInput>;

export type CreateDeliverableInput = Omit<
  Deliverable,
  'id' | 'created_at' | 'uploaded_by' | 'download_count'
>;

export type CreateInvoiceInput = Omit<
  Invoice,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'created_by'
  | 'sent_at'
  | 'viewed_at'
  | 'paid_at'
>;

export type UpdateInvoiceInput = Partial<CreateInvoiceInput>;

export type CreateExpenseInput = Omit<
  Expense,
  'id' | 'created_at'
>;

export type UpdateExpenseInput = Partial<CreateExpenseInput>;

export type CreateMessageInput = Omit<
  Message,
  'id' | 'created_at' | 'sender_id' | 'read_by'
>;

export type CreateContractInput = Omit<
  Contract,
  | 'id'
  | 'created_at'
  | 'created_by'
  | 'sent_at'
  | 'viewed_at'
  | 'signed_at'
  | 'signature_data'
>;

export type UpdateContractInput = Partial<CreateContractInput>;

export type CreateFilmingRequestInput = Omit<
  FilmingRequest,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'status'
  | 'reviewed_by'
  | 'reviewed_at'
  | 'converted_to_project_id'
  | 'notes'
>;

export type CreateEquipmentListInput = Omit<
  EquipmentList,
  'id' | 'created_at' | 'updated_at' | 'created_by'
>;

export type UpdateEquipmentListInput = Partial<CreateEquipmentListInput>;

export type CreateShotListInput = Omit<
  ShotList,
  'id' | 'created_at' | 'updated_at' | 'created_by'
>;

export type UpdateShotListInput = Partial<CreateShotListInput>;

export type CreateConceptNoteInput = Omit<
  ConceptNote,
  'id' | 'created_at' | 'updated_at' | 'created_by'
>;

export type UpdateConceptNoteInput = Partial<CreateConceptNoteInput>;

/**
 * Lead (CRM)
 */
export type Lead = {
  id: string;
  contact_name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  source: LeadSource;
  stage: LeadStage;
  deal_value: number | null;
  probability: number;
  notes: string | null;
  assigned_to: string;
  lost_reason: string | null;
  expected_close_date: string | null;
  last_contacted_at: string | null;
  converted_to_client_id: string | null;
  converted_at: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Lead Activity
 */
export type LeadActivity = {
  id: string;
  lead_id: string;
  user_id: string;
  activity_type: LeadActivityType;
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type LeadWithActivities = Lead & {
  activities: LeadActivity[];
};

/**
 * Knowledge Base Category
 */
export type KbCategory = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  sort_order: number;
  parent_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

/**
 * Knowledge Base Article
 */
export type KbArticle = {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  content: string;
  summary: string | null;
  video_urls: string[];
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

/**
 * Sales Resource Category
 */
export type SalesResourceCategory = {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
  created_at: string;
};

/**
 * Sales Resource
 */
export type SalesResource = {
  id: string;
  category_id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_name: string;
  file_size: number;
  file_type: string;
  uploaded_by: string;
  created_at: string;
};

/**
 * Filter and query types
 */
export type ProjectFilters = {
  client_id?: string;
  status?: ProjectStatus | ProjectStatus[];
  priority?: Priority | Priority[];
  project_type?: ProjectType | ProjectType[];
  created_by?: string;
  tags?: string[];
  search?: string;
  start_date_from?: string;
  start_date_to?: string;
  deadline_from?: string;
  deadline_to?: string;
};

export type TaskFilters = {
  project_id?: string;
  status?: TaskStatus | TaskStatus[];
  priority?: Priority | Priority[];
  assigned_to?: string;
  created_by?: string;
  due_date_from?: string;
  due_date_to?: string;
};

export type InvoiceFilters = {
  project_id?: string;
  client_id?: string;
  status?: InvoiceStatus | InvoiceStatus[];
  issue_date_from?: string;
  issue_date_to?: string;
  due_date_from?: string;
  due_date_to?: string;
};

export type ExpenseFilters = {
  project_id?: string;
  category?: ExpenseCategory | ExpenseCategory[];
  billable?: boolean;
  date_from?: string;
  date_to?: string;
};

export type ClientFilters = {
  status?: ClientStatus | ClientStatus[];
  search?: string;
};

export type LeadFilters = {
  stage?: LeadStage | LeadStage[];
  source?: LeadSource | LeadSource[];
  assigned_to?: string;
  search?: string;
  expected_close_from?: string;
  expected_close_to?: string;
};

/**
 * Pagination types
 */
export type PaginationParams = {
  page?: number;
  per_page?: number;
  order_by?: string;
  order_direction?: 'asc' | 'desc';
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
};

/**
 * Dashboard and analytics types
 */
export type ProjectStats = {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  archived_projects: number;
  projects_by_status: Record<ProjectStatus, number>;
  projects_by_type: Record<ProjectType, number>;
  overdue_projects: number;
};

export type InvoiceStats = {
  total_invoiced: number;
  total_paid: number;
  total_outstanding: number;
  total_overdue: number;
  invoices_by_status: Record<InvoiceStatus, number>;
  average_payment_time: number;
};

export type ExpenseStats = {
  total_expenses: number;
  billable_expenses: number;
  non_billable_expenses: number;
  expenses_by_category: Record<ExpenseCategory, number>;
};

export type DashboardStats = {
  projects: ProjectStats;
  invoices: InvoiceStats;
  expenses: ExpenseStats;
  recent_activity: ActivityLog[];
  upcoming_deadlines: Project[];
};
