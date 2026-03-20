import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseInvoiceText } from '@/lib/invoice-parser'
import type { ParsedInvoice } from '@/lib/invoice-parser'

export const maxDuration = 60

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MIN_TEXT_LENGTH = 50

export async function POST(request: NextRequest): Promise<NextResponse<ParsedInvoice | { error: string }>> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Strategy 1: Text layer extraction (fast, works for digital PDFs)
    let text = await extractTextLayer(buffer)

    // Strategy 2: OCR fallback (slow, for scanned PDFs)
    if (text.length < MIN_TEXT_LENGTH) {
      text = await ocrFallback(buffer)
    }

    // If still no text, return empty result — user fills form manually
    if (text.length < MIN_TEXT_LENGTH) {
      const empty: ParsedInvoice = {
        date: null, invoiceNumber: null, invoiceType: null, mark: null,
        issuerName: null, issuerAfm: null, customerName: null, customerAfm: null,
        description: null, netAmount: null, vatPercent: null, vatAmount: null, totalAmount: null,
      }
      return NextResponse.json(empty)
    }

    return NextResponse.json(parseInvoiceText(text))
  } catch (err: unknown) {
    console.error('Invoice parse error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to parse invoice' },
      { status: 500 },
    )
  }
}

/** Extract text layer from PDF using pdfjs-dist (no canvas needed) */
async function extractTextLayer(buffer: Buffer): Promise<string> {
  try {
    // @ts-expect-error — pdfjs-dist ESM module, no matching .d.ts for .mjs path
    const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs')

    const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise
    const textParts: string[] = []

    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items
        .filter((item: unknown): item is { str: string } => typeof item === 'object' && item !== null && 'str' in item)
        .map((item: { str: string }) => item.str)
        .join(' ')
      textParts.push(pageText)
    }

    return textParts.join('\n')
  } catch (err) {
    console.error('PDF text extraction failed:', err)
    return ''
  }
}

/** OCR fallback: render PDF pages to PNG via canvas, then tesseract */
async function ocrFallback(buffer: Buffer): Promise<string> {
  try {
    // @ts-expect-error — pdfjs-dist ESM module, no matching .d.ts for .mjs path
    const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs')
    const { createCanvas } = await import('canvas')
    const Tesseract = await import('tesseract.js')

    const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise
    const worker = await Tesseract.createWorker('ell+eng')
    const textParts: string[] = []

    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i)
      const viewport = page.getViewport({ scale: 2.0 })
      const canvas = createCanvas(viewport.width, viewport.height)
      const ctx = canvas.getContext('2d')

      await page.render({ canvasContext: ctx as unknown as CanvasRenderingContext2D, viewport }).promise

      const pngBuffer = canvas.toBuffer('image/png')
      const { data: { text } } = await worker.recognize(pngBuffer)
      textParts.push(text)
    }

    await worker.terminate()
    return textParts.join('\n')
  } catch (err) {
    console.error('OCR fallback failed:', err)
    return ''
  }
}
