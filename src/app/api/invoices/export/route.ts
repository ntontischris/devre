import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const dateParamSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateFrom = dateParamSchema.safeParse(searchParams.get('from') || undefined).data;
    const dateTo = dateParamSchema.safeParse(searchParams.get('to') || undefined).data;

    let query = supabase
      .from('invoices')
      .select('*, client:clients(contact_name, company_name, email), project:projects(title)')
      .order('issue_date', { ascending: false });

    if (dateFrom) query = query.gte('issue_date', dateFrom);
    if (dateTo) query = query.lte('issue_date', dateTo);

    const { data: invoices, error } = await query;
    if (error) {
      console.error('Invoice export query error:', error);
      return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
    }

    // Build CSV
    type InvoiceRow = {
      invoice_number: string;
      client?: { company_name?: string; contact_name?: string } | null;
      project?: { title?: string } | null;
      issue_date: string;
      due_date: string;
      status: string;
      subtotal?: number | null;
      tax_amount?: number | null;
      total?: number | null;
      currency?: string | null;
    };

    const headers = ['Invoice Number', 'Client', 'Project', 'Issue Date', 'Due Date', 'Status', 'Subtotal', 'Tax', 'Total', 'Currency'];
    const rows = (invoices || []).map((inv: InvoiceRow) => [
      inv.invoice_number,
      inv.client?.company_name || inv.client?.contact_name || '',
      inv.project?.title || '',
      inv.issue_date,
      inv.due_date,
      inv.status,
      inv.subtotal?.toFixed(2) || '0.00',
      inv.tax_amount?.toFixed(2) || '0.00',
      inv.total?.toFixed(2) || '0.00',
      inv.currency || 'EUR',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row: string[]) => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="invoices-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to export invoices' }, { status: 500 });
  }
}
