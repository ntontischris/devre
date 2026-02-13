'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClientSchema } from '@/lib/schemas/client';
import type { z } from 'zod';

type ClientFormValues = z.input<typeof createClientSchema>;
import { createNewClient, updateClient } from '@/lib/actions/clients';
import { Client } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';
import { CLIENT_STATUSES, CLIENT_STATUS_LABELS } from '@/lib/constants';

interface ClientFormProps {
  client?: Client;
  onSuccess?: () => void;
}

export function ClientForm({ client, onSuccess }: ClientFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!client;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ClientFormValues>({
    resolver: zodResolver(createClientSchema),
    defaultValues: client
      ? {
          contact_name: client.contact_name,
          email: client.email,
          company_name: client.company_name || '',
          phone: client.phone || '',
          address: client.address || '',
          vat_number: client.vat_number || '',
          notes: client.notes || '',
          status: client.status,
        }
      : {
          status: 'active',
        },
  });

  const status = watch('status');

  const onSubmit = async (data: ClientFormValues) => {
    setIsSubmitting(true);
    try {
      const result = isEditing
        ? await updateClient(client.id, data)
        : await createNewClient(data);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          isEditing
            ? 'Client updated successfully'
            : 'Client created successfully'
        );
        if (onSuccess) {
          onSuccess();
        }
        if (!isEditing) {
          const newClient = result.data as Client;
          router.push(`/admin/clients/${newClient.id}`);
        } else {
          router.push(`/admin/clients/${client.id}`);
        }
        router.refresh();
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar</Label>
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                {client?.avatar_url ? (
                  <img
                    src={client.avatar_url}
                    alt={client.contact_name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <Upload className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  disabled
                  className="cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Avatar upload coming soon
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact_name">
                Contact Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contact_name"
                {...register('contact_name')}
                placeholder="John Doe"
              />
              {errors.contact_name && (
                <p className="text-sm text-destructive">
                  {errors.contact_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                {...register('company_name')}
                placeholder="Acme Inc."
              />
              {errors.company_name && (
                <p className="text-sm text-destructive">
                  {errors.company_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vat_number">VAT Number</Label>
              <Input
                id="vat_number"
                {...register('vat_number')}
                placeholder="VAT123456"
              />
              {errors.vat_number && (
                <p className="text-sm text-destructive">
                  {errors.vat_number.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setValue('status', value as ClientFormValues['status'])
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {CLIENT_STATUSES.map((statusOption) => (
                    <SelectItem key={statusOption} value={statusOption}>
                      {CLIENT_STATUS_LABELS[statusOption]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              {...register('address')}
              placeholder="123 Main St, City, State, ZIP"
              rows={3}
            />
            {errors.address && (
              <p className="text-sm text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional notes about this client..."
              rows={4}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>
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
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update Client' : 'Create Client'}
        </Button>
      </div>
    </form>
  );
}
