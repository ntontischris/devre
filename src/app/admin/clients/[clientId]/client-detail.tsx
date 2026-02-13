'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Client } from '@/types/index';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { UserAvatar } from '@/components/shared/user-avatar';
import { EmptyState } from '@/components/shared/empty-state';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Pencil,
  Trash,
  Mail,
  Phone,
  MapPin,
  FileText,
  Briefcase,
  Receipt,
  Activity,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { deleteClient } from '@/lib/actions/clients';
import { toast } from 'sonner';

interface ClientDetailProps {
  client: Client;
}

export function ClientDetail({ client }: ClientDetailProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteClient(client.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Client deleted successfully');
        router.push('/admin/clients');
        router.refresh();
      }
    } catch (error) {
      toast.error('Failed to delete client');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={client.contact_name}
        description={client.company_name || 'Individual Client'}
      >
        <Button variant="outline" asChild>
          <Link href="/admin/clients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/admin/clients/${client.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
        <Button
          variant="outline"
          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <UserAvatar
              name={client.contact_name}
              src={client.avatar_url}
              className="h-20 w-20"
            />
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{client.contact_name}</h2>
                {client.company_name && (
                  <p className="text-muted-foreground">{client.company_name}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <StatusBadge status={client.status} />
                <span className="text-sm text-muted-foreground">
                  Created {format(new Date(client.created_at), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="inline-flex w-auto min-w-full sm:min-w-0">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Email</p>
                    <a
                      href={`mailto:${client.email}`}
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      {client.email}
                    </a>
                  </div>
                </div>

                {client.phone && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Phone</p>
                        <a
                          href={`tel:${client.phone}`}
                          className="text-sm text-muted-foreground hover:underline"
                        >
                          {client.phone}
                        </a>
                      </div>
                    </div>
                  </>
                )}

                {client.address && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">Address</p>
                        <p className="text-sm text-muted-foreground">
                          {client.address}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {client.vat_number && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <FileText className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">VAT Number</p>
                        <p className="text-sm text-muted-foreground">
                          {client.vat_number}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              {client.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {client.notes}
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Active Projects
                    </span>
                    <span className="text-2xl font-bold">0</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Invoices
                    </span>
                    <span className="text-2xl font-bold">0</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total Revenue
                    </span>
                    <span className="text-2xl font-bold">$0</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardContent className="pt-6">
              <EmptyState
                icon={Briefcase}
                title="No projects yet"
                description="This client doesn't have any projects. Create a new project to get started."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardContent className="pt-6">
              <EmptyState
                icon={Receipt}
                title="No invoices yet"
                description="This client doesn't have any invoices. Create a new invoice to get started."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardContent className="pt-6">
              <EmptyState
                icon={Activity}
                title="No activity yet"
                description="Activity logs for this client will appear here once actions are taken."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Client"
        description={`Are you sure you want to delete ${client.contact_name}? This action cannot be undone and will remove all associated data.`}
        confirmLabel="Delete"
        loading={isDeleting}
        destructive
      />
    </div>
  );
}
