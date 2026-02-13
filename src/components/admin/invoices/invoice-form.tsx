'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createInvoiceSchema, type LineItem } from '@/lib/schemas/invoice';
import { createInvoice, updateInvoice } from '@/lib/actions/invoices';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { LineItemsEditor } from './line-items-editor';
import { InvoiceSummary } from './invoice-summary';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { DEFAULT_TAX_RATE } from '@/lib/constants';

interface InvoiceFormProps {
  invoice?: any;
  clients: any[];
  projects: any[];
  nextInvoiceNumber: string;
}

type FormData = z.input<typeof createInvoiceSchema>;

export function InvoiceForm({ invoice, clients, projects, nextInvoiceNumber }: InvoiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedClientId, setSelectedClientId] = React.useState<string>(invoice?.client_id || '');

  const defaultLineItems: LineItem[] = [
    { description: '', quantity: 1, unit_price: 0 },
  ];

  const form = useForm<FormData>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      client_id: invoice?.client_id || '',
      project_id: invoice?.project_id || undefined,
      issue_date: invoice?.issue_date || new Date().toISOString().split('T')[0],
      due_date: invoice?.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      tax_rate: invoice?.tax_rate || DEFAULT_TAX_RATE,
      line_items: invoice?.line_items || defaultLineItems,
      notes: invoice?.notes || '',
      currency: invoice?.currency || 'EUR',
    },
  });

  const lineItems = form.watch('line_items') || [];
  const taxRate = form.watch('tax_rate') || DEFAULT_TAX_RATE;

  const subtotal = React.useMemo(() => {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  }, [lineItems]);

  const taxAmount = React.useMemo(() => {
    return subtotal * (taxRate / 100);
  }, [subtotal, taxRate]);

  const total = React.useMemo(() => {
    return subtotal + taxAmount;
  }, [subtotal, taxAmount]);

  const clientProjects = React.useMemo(() => {
    if (!selectedClientId) return [];
    return projects.filter(p => p.client_id === selectedClientId);
  }, [selectedClientId, projects]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    const result = invoice
      ? await updateInvoice(invoice.id, data)
      : await createInvoice(data);

    setIsSubmitting(false);

    if (result.error) {
      toast.error(invoice ? 'Failed to update invoice' : 'Failed to create invoice', {
        description: result.error,
      });
    } else {
      toast.success(invoice ? 'Invoice updated successfully' : 'Invoice created successfully');
      router.push(`/admin/invoices/${result.data.id}`);
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FormLabel>Invoice Number</FormLabel>
                <Input value={nextInvoiceNumber} disabled className="bg-muted" />
                <p className="text-sm text-muted-foreground mt-1">Auto-generated</p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedClientId(value);
                      form.setValue('project_id', undefined);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.company_name || client.contact_name}
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
              name="project_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project (Optional)</FormLabel>
                  <Select
                    value={field.value || 'none'}
                    onValueChange={(v) => field.onChange(v === 'none' ? undefined : v)}
                    disabled={!selectedClientId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {clientProjects.map((project) => (
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

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="issue_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tax_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Rate (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="line_items"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LineItemsEditor
                      items={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-6">
              <InvoiceSummary
                subtotal={subtotal}
                taxRate={taxRate}
                taxAmount={taxAmount}
                total={total}
                currency="EUR"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes or payment terms..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : invoice ? 'Update Invoice' : 'Create Invoice'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
