'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createExpenseSchema } from '@/lib/schemas/expense';
import { createExpense } from '@/lib/actions/expenses';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { z } from 'zod';
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_LABELS } from '@/lib/constants';
import { Upload } from 'lucide-react';

interface ExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: any[];
  onSuccess: () => void;
}

type FormData = z.input<typeof createExpenseSchema>;

export function ExpenseForm({ open, onOpenChange, projects, onSuccess }: ExpenseFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      category: 'other',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      project_id: undefined,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    const result = await createExpense(data);
    setIsSubmitting(false);

    if (result.error) {
      toast.error('Failed to create expense', { description: result.error });
    } else {
      toast.success('Expense created successfully');
      form.reset();
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {EXPENSE_CATEGORY_LABELS[category]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter expense description..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (EUR)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="project_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project (Optional)</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Receipt Upload</FormLabel>
              <div className="mt-2">
                <Button type="button" variant="outline" disabled className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Receipt (Coming Soon)
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Receipt upload functionality will be available soon
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Expense'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
