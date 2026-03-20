/**
 * Client-side PDF → image rendering + server-side AI extraction.
 * Renders PDF pages to images in the browser, sends to GPT-4o-mini vision.
 */
import type { ParsedInvoice } from '@/lib/invoice-parser';

/** Parse a PDF: render to image in browser, send to AI for extraction */
export async function parseInvoiceClientSide(file: File): Promise<ParsedInvoice> {
  const arrayBuffer = await file.arrayBuffer();

  // Render first page to base64 PNG
  const base64Image = await renderPdfPageToBase64(arrayBuffer);

  if (!base64Image) {
    return emptyResult();
  }

  // Send to API route for AI extraction
  const response = await fetch('/api/invoices/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error ?? 'Parse failed');
  }

  return response.json();
}

/** Render first page of PDF to base64 PNG using browser canvas */
async function renderPdfPageToBase64(arrayBuffer: ArrayBuffer): Promise<string | null> {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    const doc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
    const page = await doc.getPage(1);
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport }).promise;

    const dataUrl = canvas.toDataURL('image/png');
    // Strip "data:image/png;base64," prefix
    const base64 = dataUrl.split(',')[1];

    canvas.width = 0;
    canvas.height = 0;

    return base64;
  } catch (err) {
    console.error('PDF render failed:', err);
    return null;
  }
}

function emptyResult(): ParsedInvoice {
  return {
    date: null,
    invoiceNumber: null,
    invoiceType: null,
    mark: null,
    issuerName: null,
    issuerAfm: null,
    customerName: null,
    customerAfm: null,
    description: null,
    netAmount: null,
    vatPercent: null,
    vatAmount: null,
    totalAmount: null,
  };
}
