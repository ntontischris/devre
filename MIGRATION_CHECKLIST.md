# i18n Migration Checklist - Admin Project Management

## ✅ COMPLETED FILES

### Admin Pages
- ✅ src/app/admin/projects/page.tsx
- ✅ src/app/admin/projects/new/page.tsx
- ✅ src/app/admin/projects/[projectId]/page.tsx
- ✅ src/app/admin/projects/[projectId]/edit/page.tsx
- ✅ src/app/admin/projects/projects-content.tsx
- ✅ src/app/admin/projects/[projectId]/project-detail.tsx
- ✅ src/app/admin/projects/[projectId]/tasks-tab.tsx
- ✅ src/app/admin/projects/[projectId]/deliverables-tab.tsx
- ✅ src/app/admin/projects/[projectId]/contracts-tab.tsx

### Project Components
- ✅ src/components/admin/projects/view-toggle.tsx (no text to translate)
- ✅ src/components/admin/projects/project-form.tsx
- ✅ src/components/admin/projects/project-card.tsx (no visible text)
- ✅ src/components/admin/projects/project-board.tsx
- ✅ src/components/admin/projects/project-column.tsx (minimal text - status labels already translated via constants)
- ✅ src/components/admin/projects/project-list.tsx

## 🔄 REMAINING FILES TO MIGRATE

### Task Components
- ⏳ src/components/admin/tasks/task-board.tsx
  - Line 84: "Failed to update task status" → t('statusUpdateFailed')
  - Line 88: "Task moved successfully" → t('statusUpdated')

- ⏳ src/components/admin/tasks/task-card.tsx
  - Line 119: "subtasks" → t('subtasks')

- ⏳ src/components/admin/tasks/task-column.tsx
  - No user-visible strings (uses TASK_STATUS_LABELS from constants)

- ⏳ src/components/admin/tasks/quick-add-task.tsx
  - Line 28: "Task title is required" → t('taskTitleRequired')
  - Line 43: "Failed to create task" → t('createFailed')
  - Line 47: "Task created successfully" → t('taskCreated')
  - Line 68: "Add task" → t('addTask')
  - Line 76: "Task title..." → t('taskTitlePlaceholder')
  - Line 89: "Add" → tc('add')

- ⏳ src/components/admin/tasks/task-detail-sheet.tsx
  - Full migration needed (not read yet - contains form labels, buttons, etc.)

- ⏳ src/components/admin/tasks/task-filters.tsx
  - Full migration needed (not read yet - contains filter labels)

- ⏳ src/components/admin/tasks/sub-task-list.tsx
  - Full migration needed (not read yet - contains subtask UI)

### Deliverable Components
- ⏳ src/components/admin/deliverables/video-upload.tsx
  - Full migration needed (upload UI, buttons, messages)

- ⏳ src/components/admin/deliverables/deliverable-list.tsx
  - Full migration needed (table headers, actions)

- ⏳ src/components/admin/deliverables/approval-actions.tsx
  - Full migration needed (approval buttons and messages)

- ⏳ src/components/admin/deliverables/version-history.tsx
  - Full migration needed (version history UI)

- ⏳ src/components/admin/deliverables/deliverable-detail.tsx
  - Full migration needed (detail view, annotations, etc.)

### Contract Components
- ⏳ src/components/admin/contracts/template-list.tsx
  - Full migration needed (template list UI)

- ⏳ src/components/admin/contracts/contract-preview.tsx
  - Full migration needed (preview UI)

- ⏳ src/components/admin/contracts/contract-creator.tsx
  - Full migration needed (contract creation form)

- ⏳ src/components/admin/contracts/template-form.tsx
  - Full migration needed (template form)

- ⏳ src/components/admin/contracts/contract-list.tsx
  - Full migration needed (contract list with actions)

## MIGRATION PATTERN

### For Client Components ('use client'):
```typescript
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('tasks'); // or 'deliverables' or 'contracts'
  const tc = useTranslations('common'); // for common strings

  // Replace hardcoded strings:
  // "Add task" → t('addTask')
  // "Save" → tc('save')
  // "Cancel" → tc('cancel')
}
```

### For Server Components (async pages):
```typescript
import { getTranslations } from 'next-intl/server';

export default async function MyPage() {
  const t = await getTranslations('tasks');
  const tc = await getTranslations('common');

  // Use in JSX
}
```

## TRANSLATION KEYS REFERENCE

### Tasks (namespace: 'tasks')
- title, addTask, editTask, deleteTask
- taskName, assignee, dueDate
- noTasks, noTasksDescription
- quickAdd, subtasks, addSubtask
- taskCreated, taskUpdated, taskDeleted, statusUpdated
- dragToReorder

### Deliverables (namespace: 'deliverables')
- title, description, addDeliverable, editDeliverable, deleteDeliverable
- deliverableName, version, uploadFile
- noDeliverables, noDeliverablesDescription
- approve, requestRevision, markAsFinal, revisionNotes
- versionHistory, uploadNewVersion
- approved, revisionRequested, markedFinal, uploaded
- annotations, addAnnotation, timestamp, annotationText

### Contracts (namespace: 'contracts')
- title, description, addContract, editContract, deleteContract
- contractDetails, contractTitle, template, selectTemplate
- noContracts, noContractsDescription
- sendForSignature, signed, signedBy, signedAt
- signContract, signature, clearSignature, iAgree
- contractCreated, contractSent, contractSigned
- templates, addTemplate, editTemplate, deleteTemplate
- templateName, templateContent, noTemplates
- templateCreated, templateUpdated, templateDeleted
- downloadPdf, preview

### Common (namespace: 'common')
- save, cancel, delete, edit, view, add, back
- actions, status, priority, description
- loading, pleaseWait, saving, deleting
- confirmDelete, confirmDeleteMessage
- success, error, warning, info

## TESTING AFTER MIGRATION

1. Build check: `npm run build`
2. Type check: `npx tsc --noEmit`
3. Verify all pages render without errors
4. Check that all buttons/labels display translation keys correctly
5. Test language switching (if implemented)
