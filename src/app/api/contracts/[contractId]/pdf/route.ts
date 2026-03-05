import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createClient } from '@/lib/supabase/server';
import { getContract } from '@/lib/actions/contracts';
import { ContractPDFTemplate } from '@/lib/pdf/contract-template';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contractId: string }> },
) {
  try {
    // Auth check
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { contractId } = await params;

    const result = await getContract(contractId);

    if (result.error || !result.data) {
      return NextResponse.json({ error: result.error || 'Contract not found' }, { status: 404 });
    }

    const contract = result.data;

    const pdfBuffer = await renderToBuffer(
      ContractPDFTemplate({
        contract,
        clientName: contract.client?.contact_name || contract.client?.company_name || undefined,
        projectTitle: contract.project?.title || undefined,
      }),
    );

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="contract-${contractId}.pdf"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
