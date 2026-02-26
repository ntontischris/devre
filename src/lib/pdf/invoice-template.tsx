import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

// Disable hyphenation for Greek
Font.registerHyphenationCallback((word) => [word]);

// Noto Sans — full Greek support
Font.register({
  family: 'NotoSans',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSans/NotoSans-Regular.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSans/NotoSans-Bold.ttf',
      fontWeight: 'bold',
    },
  ],
});

// ─── Palette ────────────────────────────────────────────────
const C = {
  dark:       '#0f172a',
  navy:       '#1e3a5f',
  blue:       '#2563eb',
  lightBlue:  '#eff6ff',
  border:     '#e2e8f0',
  rowAlt:     '#f8fafc',
  text:       '#1e293b',
  muted:      '#64748b',
  white:      '#ffffff',
  paidGreen:  '#16a34a',
  sentBlue:   '#2563eb',
  overdue:    '#dc2626',
  draft:      '#94a3b8',
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSans',
    fontSize: 9,
    color: C.text,
    backgroundColor: C.white,
    paddingBottom: 60,
  },

  /* ── Top accent bar ── */
  topBar: {
    height: 6,
    backgroundColor: C.blue,
  },

  /* ── Header ── */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 40,
    paddingTop: 28,
    paddingBottom: 24,
    backgroundColor: C.dark,
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: C.white,
    letterSpacing: 1,
  },
  companyTagline: {
    fontSize: 8,
    color: '#94a3b8',
    marginTop: 3,
  },
  companyContact: {
    fontSize: 8,
    color: '#94a3b8',
    marginTop: 1,
  },
  invoiceHeading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: C.white,
    textAlign: 'right',
    letterSpacing: 2,
  },
  invoiceNumber: {
    fontSize: 10,
    color: '#93c5fd',
    textAlign: 'right',
    marginTop: 4,
  },
  statusBadge: {
    marginTop: 8,
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  /* ── Body ── */
  body: {
    paddingHorizontal: 40,
    paddingTop: 28,
  },

  /* ── Info section (bill-to + invoice details) ── */
  infoRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 28,
  },
  infoCard: {
    flex: 1,
    backgroundColor: C.rowAlt,
    borderRadius: 6,
    padding: 14,
    borderLeft: `3px solid ${C.blue}`,
  },
  infoCardRight: {
    flex: 1,
    backgroundColor: C.rowAlt,
    borderRadius: 6,
    padding: 14,
  },
  infoLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: C.blue,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 7,
  },
  infoName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: C.text,
    marginBottom: 3,
  },
  infoLine: {
    fontSize: 8.5,
    color: C.muted,
    marginBottom: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailKey: {
    fontSize: 8.5,
    color: C.muted,
  },
  detailValue: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: C.text,
    textAlign: 'right',
  },

  /* ── Table ── */
  tableWrapper: {
    marginBottom: 20,
    borderRadius: 6,
    overflow: 'hidden',
    border: `1px solid ${C.border}`,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: C.navy,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  thText: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: C.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  tableRowAlt: {
    backgroundColor: C.rowAlt,
  },
  tdDesc: { width: '50%', fontSize: 8.5, color: C.text },
  tdQty:  { width: '12%', fontSize: 8.5, textAlign: 'right', color: C.muted },
  tdPrice:{ width: '19%', fontSize: 8.5, textAlign: 'right', color: C.muted },
  tdTotal:{ width: '19%', fontSize: 8.5, textAlign: 'right', fontWeight: 'bold', color: C.text },

  /* ── Totals ── */
  totalsWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  totalsBox: {
    width: 230,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  totalsKey: {
    fontSize: 9,
    color: C.muted,
  },
  totalsVal: {
    fontSize: 9,
    color: C.text,
  },
  totalsDivider: {
    borderTopWidth: 1,
    borderTopColor: C.border,
    marginVertical: 2,
  },
  grandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: C.navy,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 4,
    marginTop: 4,
  },
  grandKey: {
    fontSize: 10,
    fontWeight: 'bold',
    color: C.white,
  },
  grandVal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: C.white,
  },

  /* ── Notes ── */
  notesBox: {
    backgroundColor: C.lightBlue,
    borderRadius: 6,
    padding: 14,
    marginBottom: 20,
    borderLeft: `3px solid ${C.blue}`,
  },
  notesLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: C.blue,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  notesText: {
    fontSize: 8.5,
    color: C.text,
    lineHeight: 1.6,
  },

  /* ── Footer ── */
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.dark,
    paddingVertical: 12,
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
  },
  footerBrand: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#93c5fd',
  },
});

// ─── Helpers ────────────────────────────────────────────────

function fmt(amount: number, currency: string): string {
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: currency || 'EUR',
    minimumFractionDigits: 2,
  }).format(amount);
}

function fmtDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'd MMMM yyyy', { locale: el });
  } catch {
    return dateStr;
  }
}

function statusStyle(status: string): { bg: string; color: string; label: string } {
  switch (status) {
    case 'paid':    return { bg: '#dcfce7', color: C.paidGreen, label: 'ΕΞΟΦΛΗΜΕΝΟ' };
    case 'sent':    return { bg: '#dbeafe', color: C.sentBlue,  label: 'ΑΠΕΣΤΑΛΜΕΝΟ' };
    case 'viewed':  return { bg: '#dbeafe', color: C.sentBlue,  label: 'ΕΧΕΙ ΔΙΑΒΑΣΤΕΙ' };
    case 'overdue': return { bg: '#fee2e2', color: C.overdue,   label: 'ΛΗΞΙΠΡΟΘΕΣΜΟ' };
    case 'draft':   return { bg: '#f1f5f9', color: C.draft,     label: 'ΠΡΟΣΧΕΔΙΟ' };
    default:        return { bg: '#f1f5f9', color: C.draft,     label: status.toUpperCase() };
  }
}

// ─── Props ──────────────────────────────────────────────────

interface InvoicePDFTemplateProps {
  invoice: {
    invoice_number: string;
    issue_date: string;
    due_date: string;
    status: string;
    subtotal: number;
    tax_amount: number;
    tax_rate?: number | null;
    total: number;
    currency: string;
    notes?: string | null;
    line_items: Array<{
      description: string;
      quantity: number;
      unit_price: number;
    }>;
  };
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  projectTitle: string;
}

// ─── Component ──────────────────────────────────────────────

export function InvoicePDFTemplate({
  invoice,
  clientName,
  clientEmail,
  clientAddress,
  projectTitle,
}: InvoicePDFTemplateProps) {
  const { bg, color, label } = statusStyle(invoice.status);
  const taxRate = invoice.tax_rate ?? 24;
  const currency = invoice.currency || 'EUR';

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── Top accent bar ── */}
        <View style={styles.topBar} />

        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>DEVRE MEDIA</Text>
            <Text style={styles.companyTagline}>Video Production Services</Text>
            <Text style={styles.companyContact}>info@devremedia.gr</Text>
          </View>
          <View>
            <Text style={styles.invoiceHeading}>ΤΙΜΟΛΟΓΙΟ</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoice_number}</Text>
            <View style={[styles.statusBadge, { backgroundColor: bg }]}>
              <Text style={[styles.statusText, { color }]}>{label}</Text>
            </View>
          </View>
        </View>

        {/* ── Body ── */}
        <View style={styles.body}>

          {/* ── Info cards ── */}
          <View style={styles.infoRow}>
            {/* Bill To */}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Προς</Text>
              <Text style={styles.infoName}>{clientName}</Text>
              {clientEmail ? <Text style={styles.infoLine}>{clientEmail}</Text> : null}
              {clientAddress ? <Text style={styles.infoLine}>{clientAddress}</Text> : null}
            </View>

            {/* Invoice details */}
            <View style={styles.infoCardRight}>
              <Text style={styles.infoLabel}>Στοιχεία Τιμολογίου</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Ημ/νία Έκδοσης</Text>
                <Text style={styles.detailValue}>{fmtDate(invoice.issue_date)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Ημ/νία Λήξης</Text>
                <Text style={styles.detailValue}>{fmtDate(invoice.due_date)}</Text>
              </View>
              {projectTitle ? (
                <View style={styles.detailRow}>
                  <Text style={styles.detailKey}>Έργο</Text>
                  <Text style={styles.detailValue}>{projectTitle}</Text>
                </View>
              ) : null}
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Νόμισμα</Text>
                <Text style={styles.detailValue}>{currency}</Text>
              </View>
            </View>
          </View>

          {/* ── Line items table ── */}
          <View style={styles.tableWrapper}>
            <View style={styles.tableHeader}>
              <Text style={[styles.thText, { width: '50%' }]}>Περιγραφή</Text>
              <Text style={[styles.thText, { width: '12%', textAlign: 'right' }]}>Ποσ.</Text>
              <Text style={[styles.thText, { width: '19%', textAlign: 'right' }]}>Τιμή Μον.</Text>
              <Text style={[styles.thText, { width: '19%', textAlign: 'right' }]}>Σύνολο</Text>
            </View>
            {invoice.line_items.map((item, i) => (
              <View
                key={i}
                style={[styles.tableRow, i % 2 !== 0 ? styles.tableRowAlt : {}]}
              >
                <Text style={styles.tdDesc}>{item.description}</Text>
                <Text style={styles.tdQty}>{item.quantity}</Text>
                <Text style={styles.tdPrice}>{fmt(item.unit_price, currency)}</Text>
                <Text style={styles.tdTotal}>{fmt(item.quantity * item.unit_price, currency)}</Text>
              </View>
            ))}
          </View>

          {/* ── Totals ── */}
          <View style={styles.totalsWrapper}>
            <View style={styles.totalsBox}>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsKey}>Υποσύνολο</Text>
                <Text style={styles.totalsVal}>{fmt(invoice.subtotal, currency)}</Text>
              </View>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsKey}>ΦΠΑ {taxRate}%</Text>
                <Text style={styles.totalsVal}>{fmt(invoice.tax_amount, currency)}</Text>
              </View>
              <View style={styles.totalsDivider} />
              <View style={styles.grandRow}>
                <Text style={styles.grandKey}>ΣΥΝΟΛΟ ΠΛΗΡΩΜΗΣ</Text>
                <Text style={styles.grandVal}>{fmt(invoice.total, currency)}</Text>
              </View>
            </View>
          </View>

          {/* ── Notes ── */}
          {invoice.notes ? (
            <View style={styles.notesBox}>
              <Text style={styles.notesLabel}>Σημειώσεις</Text>
              <Text style={styles.notesText}>{invoice.notes}</Text>
            </View>
          ) : null}

        </View>

        {/* ── Footer ── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Ευχαριστούμε για την εμπιστοσύνη σας.
          </Text>
          <Text style={styles.footerBrand}>DEVRE MEDIA</Text>
        </View>

      </Page>
    </Document>
  );
}
