import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { getContract } from '@/lib/actions/contracts';
import { ContractPDFTemplate } from '@/lib/pdf/contract-template';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contractId: string }> }
) {
  try {
    const { contractId } = await params;

    // Fetch contract data
    const result = await getContract(contractId);

    if (result.error || !result.data) {
      return NextResponse.json(
        { error: result.error || 'Contract not found' },
        { status: 404 }
      );
    }

    const contract = result.data;

    // Only allow PDF generation for signed contracts
    if (contract.status !== 'signed') {
      return NextResponse.json(
        { error: 'PDF generation is only available for signed contracts' },
        { status: 400 }
      );
    }

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      ContractPDFTemplate({
        contract,
        clientName: contract.client?.contact_name || contract.client?.company_name || undefined,
        projectTitle: contract.project?.title || undefined,
      })
    );

    // Return PDF response
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="contract-${contractId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
