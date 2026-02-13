import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  companyName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  companyTagline: {
    fontSize: 9,
    color: '#666',
    marginTop: 4,
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  invoiceMeta: {
    textAlign: 'right',
    fontSize: 9,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 20,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  infoBlock: {
    width: '45%',
  },
  infoLabel: {
    fontSize: 8,
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 10,
    color: '#333',
    marginBottom: 2,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  colDescription: {
    width: '50%',
    fontSize: 9,
  },
  colQty: {
    width: '15%',
    fontSize: 9,
    textAlign: 'right',
  },
  colUnitPrice: {
    width: '17.5%',
    fontSize: 9,
    textAlign: 'right',
  },
  colAmount: {
    width: '17.5%',
    fontSize: 9,
    textAlign: 'right',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 8,
    textTransform: 'uppercase',
    color: '#666',
  },
  totalsSection: {
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 4,
    width: 200,
  },
  totalLabel: {
    width: 100,
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
    paddingRight: 10,
  },
  totalValue: {
    width: 100,
    fontSize: 10,
    textAlign: 'right',
    color: '#333',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 6,
    width: 200,
    borderTopWidth: 2,
    borderTopColor: '#333',
    marginTop: 4,
  },
  grandTotalLabel: {
    width: 100,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingRight: 10,
    color: '#1a1a1a',
  },
  grandTotalValue: {
    width: 100,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#1a1a1a',
  },
  notes: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  notesLabel: {
    fontSize: 8,
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  notesText: {
    fontSize: 9,
    color: '#555',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#999',
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 4,
  },
});

interface InvoicePDFTemplateProps {
  invoice: {
    invoice_number: string;
    issue_date: string;
    due_date: string;
    status: string;
    subtotal: number;
    tax_amount: number;
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

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'EUR',
  }).format(amount);
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'paid': return '#16a34a';
    case 'sent': return '#2563eb';
    case 'overdue': return '#dc2626';
    case 'draft': return '#6b7280';
    default: return '#6b7280';
  }
}

export function InvoicePDFTemplate({
  invoice,
  clientName,
  clientEmail,
  clientAddress,
  projectTitle,
}: InvoicePDFTemplateProps) {
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMMM d, yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>Devre Media</Text>
            <Text style={styles.companyTagline}>Video Production Services</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceMeta}>{invoice.invoice_number}</Text>
            <Text style={[styles.statusBadge, { color: getStatusColor(invoice.status) }]}>
              {invoice.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Client & Invoice Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Bill To</Text>
            <Text style={styles.infoText}>{clientName}</Text>
            {clientEmail ? <Text style={styles.infoText}>{clientEmail}</Text> : null}
            {clientAddress ? <Text style={styles.infoText}>{clientAddress}</Text> : null}
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Invoice Details</Text>
            <Text style={styles.infoText}>Issue Date: {formatDate(invoice.issue_date)}</Text>
            <Text style={styles.infoText}>Due Date: {formatDate(invoice.due_date)}</Text>
            {projectTitle ? <Text style={styles.infoText}>Project: {projectTitle}</Text> : null}
          </View>
        </View>

        {/* Line Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colDescription, styles.headerText]}>Description</Text>
            <Text style={[styles.colQty, styles.headerText]}>Qty</Text>
            <Text style={[styles.colUnitPrice, styles.headerText]}>Unit Price</Text>
            <Text style={[styles.colAmount, styles.headerText]}>Amount</Text>
          </View>
          {invoice.line_items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colDescription}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colUnitPrice}>
                {formatCurrency(item.unit_price, invoice.currency)}
              </Text>
              <Text style={styles.colAmount}>
                {formatCurrency(item.quantity * item.unit_price, invoice.currency)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(invoice.subtotal, invoice.currency)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(invoice.tax_amount, invoice.currency)}
            </Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrency(invoice.total, invoice.currency)}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for your business. | Devre Media
        </Text>
      </Page>
    </Document>
  );
}
