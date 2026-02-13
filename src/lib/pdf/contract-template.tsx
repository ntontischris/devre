import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  metadata: {
    fontSize: 10,
    color: '#666',
    marginBottom: 5,
  },
  content: {
    marginBottom: 30,
    lineHeight: 1.6,
  },
  paragraph: {
    marginBottom: 12,
  },
  signatureSection: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 20,
  },
  signatureLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 10,
  },
  signatureImage: {
    width: 200,
    height: 80,
    marginBottom: 10,
  },
  signatureDate: {
    fontSize: 10,
    color: '#666',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 9,
    color: '#999',
    textAlign: 'center',
  },
});

interface ContractPDFTemplateProps {
  contract: {
    title: string;
    content: string;
    created_at: string;
    signed_at?: string | null;
    signature_image?: string | null;
    status: string;
  };
  clientName?: string;
  projectTitle?: string;
}

// Strip HTML tags for PDF rendering
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

export function ContractPDFTemplate({
  contract,
  clientName,
  projectTitle,
}: ContractPDFTemplateProps) {
  const plainContent = stripHtml(contract.content);

  // Split content into paragraphs
  const paragraphs = plainContent.split('\n\n').filter(p => p.trim());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{contract.title}</Text>
          <Text style={styles.metadata}>
            Created: {format(new Date(contract.created_at), 'MMMM d, yyyy')}
          </Text>
          {clientName && (
            <Text style={styles.metadata}>Client: {clientName}</Text>
          )}
          {projectTitle && (
            <Text style={styles.metadata}>Project: {projectTitle}</Text>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {paragraphs.map((paragraph, index) => (
            <Text key={index} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
        </View>

        {/* Signature Section */}
        {contract.status === 'signed' && contract.signature_image && (
          <View style={styles.signatureSection}>
            <Text style={styles.signatureLabel}>Client Signature:</Text>
            <Image
              src={contract.signature_image}
              style={styles.signatureImage}
            />
            {contract.signed_at && (
              <Text style={styles.signatureDate}>
                Signed on: {format(new Date(contract.signed_at), 'MMMM d, yyyy \'at\' h:mm a')}
              </Text>
            )}
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          This is a legally binding document. Contract ID: {contract.title}
        </Text>
      </Page>
    </Document>
  );
}
