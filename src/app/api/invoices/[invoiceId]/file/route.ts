import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ invoiceId: string }> },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { invoiceId } = await params;

  // Get invoice file_path
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('file_path, client_id')
    .eq('id', invoiceId)
    .single();

  if (error || !invoice?.file_path) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  // Download file from storage
  const { data: fileData, error: downloadError } = await supabase.storage
    .from('invoices')
    .download(invoice.file_path);

  if (downloadError || !fileData) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  return new NextResponse(fileData, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="invoice-${invoiceId}.pdf"`,
    },
  });
}
