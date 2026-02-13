# Zod Validation Schemas

This directory contains all Zod validation schemas for the DMS (Document Management System) entities.

## Schema Structure

Each entity has the following schemas:

- **`create*Schema`**: For creating new records (required fields)
- **`update*Schema`**: For updating existing records (typically partial/optional fields)
- **`*ResponseSchema`**: For validating API responses (includes database fields like id, timestamps)

## Usage Examples

### Basic Validation

```typescript
import { createClientSchema, type CreateClientInput } from '@/lib/schemas';

// Validate input data
const result = createClientSchema.safeParse({
  contact_name: 'John Doe',
  email: 'john@example.com',
  status: 'active'
});

if (result.success) {
  console.log('Valid data:', result.data);
} else {
  console.error('Validation errors:', result.error.errors);
}
```

### With Type Inference

```typescript
import { createProjectSchema, type CreateProjectInput } from '@/lib/schemas';

const projectData: CreateProjectInput = {
  title: 'Corporate Video',
  client_id: '123e4567-e89b-12d3-a456-426614174000',
  project_type: 'corporate_video',
  status: 'briefing',
  priority: 'high'
};

// Validate before submitting
const validated = createProjectSchema.parse(projectData);
```

### In API Routes

```typescript
import { createInvoiceSchema } from '@/lib/schemas';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createInvoiceSchema.parse(body);

    // Use validated data...
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { errors: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}
```

### With React Hook Form

```typescript
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createClientSchema, type CreateClientInput } from '@/lib/schemas';

function ClientForm() {
  const form = useForm<CreateClientInput>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      status: 'active'
    }
  });

  const onSubmit = (data: CreateClientInput) => {
    // Data is validated automatically
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  );
}
```

## Available Schemas

### Authentication (`auth.ts`)
- `loginSchema`
- `signupSchema`
- `onboardingSchema`
- `forgotPasswordSchema`
- `updatePasswordSchema`

### Clients (`client.ts`)
- `createClientSchema`
- `updateClientSchema`
- `clientResponseSchema`

### Projects (`project.ts`)
- `createProjectSchema`
- `updateProjectSchema`
- `projectResponseSchema`

### Tasks (`task.ts`)
- `createTaskSchema`
- `updateTaskSchema`
- `taskResponseSchema`

### Deliverables (`deliverable.ts`)
- `createDeliverableSchema`
- `updateDeliverableSchema`
- `deliverableResponseSchema`
- `createAnnotationSchema`
- `annotationResponseSchema`

### Invoices (`invoice.ts`)
- `lineItemSchema`
- `createInvoiceSchema`
- `updateInvoiceSchema`
- `invoiceResponseSchema`

### Contracts (`contract.ts`)
- `createContractSchema`
- `updateContractSchema`
- `contractResponseSchema`
- `signContractSchema`

### Messages (`message.ts`)
- `attachmentSchema`
- `createMessageSchema`
- `messageResponseSchema`

### Filming Requests (`filming-request.ts`)
- `preferredDateSchema`
- `createFilmingRequestSchema`
- `reviewFilmingRequestSchema`
- `filmingRequestResponseSchema`

### Filming Prep (`filming-prep.ts`)
- `equipmentItemSchema`
- `updateEquipmentListSchema`
- `shotSchema`
- `updateShotListSchema`
- `createConceptNoteSchema`
- `updateConceptNoteSchema`
- `conceptNoteResponseSchema`

### Expenses (`expense.ts`)
- `createExpenseSchema`
- `updateExpenseSchema`
- `expenseResponseSchema`

## Constants Integration

All enum fields use constants from `@/lib/constants`:

- `CLIENT_STATUSES`: active, inactive, lead
- `PROJECT_TYPES`: corporate_video, event_coverage, social_media_content, commercial, documentary, music_video, other
- `PROJECT_STATUSES`: briefing, pre_production, filming, editing, review, revisions, delivered, archived
- `PRIORITIES`: low, medium, high, urgent
- `TASK_STATUSES`: todo, in_progress, review, done
- `DELIVERABLE_STATUSES`: pending_review, approved, revision_requested, final
- `INVOICE_STATUSES`: draft, sent, viewed, paid, overdue, cancelled
- `CONTRACT_STATUSES`: draft, sent, viewed, signed, expired, cancelled
- `FILMING_REQUEST_STATUSES`: pending, reviewed, accepted, declined, converted
- `SHOT_TYPES`: wide, medium, close_up, detail, aerial, pov, tracking, other
- `EXPENSE_CATEGORIES`: equipment, travel, location, talent, post_production, software, marketing, other

## Best Practices

1. **Always validate user input**: Use schemas before inserting into database
2. **Use safeParse for user input**: Returns `{ success: boolean, data?, error? }`
3. **Use parse for trusted data**: Throws on validation failure
4. **Leverage TypeScript inference**: Use `z.infer<typeof schema>` for types
5. **Reuse schemas**: Import and compose schemas for complex validations
6. **Custom error messages**: All schemas include helpful validation messages
