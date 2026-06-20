import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { IQuotation } from '../types/quotation';
import { formatCurrency, formatDate, numberToWords } from '../lib/utils';

// Stylesheet for PDF
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#1F2937', // Dark Grey
    backgroundColor: '#FFFFFF',
    paddingBottom: 40, // Room for footer
  },
  // Cover Page Styles
  coverPage: {
    padding: 0,
    backgroundColor: '#FFFFFF',
  },
  coverHeader: {
    height: 8,
    backgroundColor: '#FF7A00', // Accent Orange Band
  },
  coverMain: {
    flex: 1,
    paddingTop: 15,
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 50,
    position: 'relative',
  },
  coverBadge: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FF7A00',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 5,
    textAlign: 'right',
  },
  coverTitle: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#0062FF', // Vibrant Blue
    lineHeight: 1.2,
    marginBottom: 8,
    textAlign: 'right',
  },
  coverSubtitle: {
    fontSize: 10,
    color: '#4B5563',
    textAlign: 'right',
  },
  coverDivider: {
    width: 80,
    height: 3,
    backgroundColor: '#FF7A00',
    marginTop: 15,
    marginBottom: 30,
    alignSelf: 'flex-end',
  },
  coverTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 15,
  },
  coverTitleBlock: {
    flex: 1,
    marginLeft: 25,
    alignItems: 'flex-end',
  },
  coverMetaBox: {
    borderLeft: 3,
    borderColor: '#0062FF',
    paddingLeft: 15,
    marginBottom: 50,
  },
  coverMetaRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  coverMetaLabel: {
    width: 120,
    fontFamily: 'Helvetica-Bold',
    color: '#4B5563',
  },
  coverMetaVal: {
    color: '#1F2937',
    flex: 1,
  },
  coverFooter: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    right: 50,
    borderTop: 1,
    borderColor: '#E5E7EB',
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  coverFooterCompany: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#0062FF',
  },
  coverFooterDivision: {
    fontSize: 8,
    color: '#6B7280',
    marginTop: 2,
  },
  coverFooterContact: {
    fontSize: 8,
    color: '#6B7280',
    textAlign: 'right',
  },

  // Standard Page Layout
  contentPage: {
    paddingTop: 85,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 60,
  },
  header: {
    position: 'absolute',
    top: 25,
    left: 40,
    width: 515, // Constrain width explicitly
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: 1,
    borderColor: '#E5E7EB',
    paddingBottom: 10,
  },
  headerLogoArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCompanyInfo: {
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0062FF',
  },
  headerSubtitle: {
    fontSize: 7,
    color: '#6B7280',
    marginTop: 2,
  },
  headerMeta: {
    textAlign: 'right',
  },
  headerQuoNo: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0062FF',
  },
  headerQuoDate: {
    fontSize: 8,
    color: '#6B7280',
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    width: 515, // Constrain width explicitly
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: 1,
    borderColor: '#E5E7EB',
    paddingTop: 8,
    fontSize: 8,
    color: '#9CA3AF',
  },
  pageNumber: {
    fontFamily: 'Helvetica',
  },

  // Headings
  sectionHeading: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#0062FF',
    backgroundColor: '#F3F4F6',
    padding: 6,
    borderRadius: 3,
    marginTop: 15,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subHeading: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0062FF',
    marginTop: 12,
    marginBottom: 6,
    borderBottom: 1,
    borderColor: '#E5E7EB',
    paddingBottom: 2,
  },

  // Text Elements
  paragraph: {
    fontSize: 9.5,
    color: '#374151',
    marginBottom: 10,
    textAlign: 'justify',
  },

  // Grid/Lists
  listGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  listItemHalf: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    marginRight: '2%',
  },
  listItemFull: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  listBullet: {
    color: '#FF7A00',
    marginRight: 6,
    fontSize: 10,
  },
  listText: {
    fontSize: 9,
    color: '#374151',
    flex: 1,
  },

  // Table Styles
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0062FF',
    color: '#FFFFFF',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  tableRowAlternate: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  colDesc: { flex: 3 },
  colQty: { flex: 0.8, textAlign: 'center' },
  colPrice: { flex: 1.2, textAlign: 'right' },
  colTotal: { flex: 1.5, textAlign: 'right' },
  tableText: { fontSize: 8.5 },
  tableTextBold: { fontSize: 8.5, fontFamily: 'Helvetica-Bold' },

  // Commercial Summary Box
  summaryWrapper: {
    alignItems: 'flex-end',
    marginTop: 5,
    marginBottom: 15,
  },
  summaryTable: {
    width: 250,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryRowLast: {
    flexDirection: 'row',
    padding: 6,
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 0,
  },
  summaryLabel: {
    flex: 1.5,
    fontSize: 9,
    color: '#4B5563',
  },
  summaryLabelBold: {
    flex: 1.5,
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0062FF',
  },
  summaryValue: {
    flex: 1,
    fontSize: 9,
    textAlign: 'right',
    color: '#1F2937',
  },
  summaryValueBold: {
    flex: 1,
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
    color: '#0062FF',
  },
  wordsText: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-BoldOblique',
    color: '#4B5563',
    marginTop: 4,
    textAlign: 'right',
    width: '100%',
  },

  // Terms and Signature Box
  termsList: {
    marginBottom: 15,
  },
  termItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  termIndex: {
    fontFamily: 'Helvetica-Bold',
    color: '#0062FF',
    marginRight: 6,
    fontSize: 9,
    width: 15,
    textAlign: 'right',
  },
  termText: {
    fontSize: 8.5,
    color: '#374151',
    flex: 1,
  },

  signatureBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingTop: 10,
  },
  sigArea: {
    width: '45%',
    alignItems: 'center',
  },
  sigLine: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#9CA3AF',
    marginTop: 40,
    marginBottom: 5,
  },
  sigTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#0062FF',
  },
  sigSubtitle: {
    fontSize: 8,
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },

  // Logo styles
  coverLogo: {
    width: 140,
    height: 70,
    objectFit: 'contain',
  },
  headerLogo: {
    width: 80,
    height: 40,
    objectFit: 'contain',
  }
});

// Standard Header for Internal Pages
const PageHeader = ({ quotation }: { quotation: IQuotation }) => (
  <View style={styles.header} fixed>
    <View style={styles.headerLogoArea}>
      <Image src="/logo.jpg" style={styles.headerLogo} />
      <View style={styles.headerCompanyInfo}>
        <Text style={styles.headerTitle}>Renvora Technologies Private Limited</Text>
        <Text style={styles.headerSubtitle}>Transforming Ideas Into Digital Solutions</Text>
      </View>
    </View>
    <View style={styles.headerMeta}>
      <Text style={styles.headerQuoNo}>{quotation.quotationNumber}</Text>
      <Text style={styles.headerQuoDate}>Date: {formatDate(quotation.quotationDate)}</Text>
    </View>
  </View>
);

// Standard Footer for Internal Pages
const PageFooter = () => (
  <View style={styles.footer} fixed>
    <Text>Renvora Technologies Private Limited (Quotation Proposal) | www.renvora.in</Text>
    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
      `Page ${pageNumber} of ${totalPages}`
    )} />
  </View>
);

// Helper to render lists in a solid two-column grid (fixes Bug 5)
const renderTwoColumnList = (items: string[], bulletSymbol: string = '•', bulletColor: string = '#F59E0B') => {
  if (!items || items.length === 0) return null;
  const half = Math.ceil(items.length / 2);
  const col1 = items.slice(0, half);
  const col2 = items.slice(half);
  
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
      {/* Column 1 */}
      <View style={{ width: '48%' }}>
        {col1.map((item, idx) => (
          <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 }}>
            <Text style={[styles.listBullet, { color: bulletColor }]}>{bulletSymbol}</Text>
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}
      </View>
      {/* Column 2 */}
      <View style={{ width: '48%' }}>
        {col2.map((item, idx) => (
          <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 }}>
            <Text style={[styles.listBullet, { color: bulletColor }]}>{bulletSymbol}</Text>
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

interface QuotationPDFProps {
  quotation: IQuotation;
}

export const QuotationPDF: React.FC<QuotationPDFProps> = ({ quotation }) => {
  // Filter out any default items that are not Website or Integration options (e.g. SEO, Custom Features) (fixes Bug 4)
  const EXCLUDED_SCOPE_ITEMS = [
    'Basic SEO',
    'Advanced SEO',
    'Admin Panel',
    'Student Portal',
    'Appointment Booking',
    'Inventory Management',
    'Attendance System'
  ];

  const filteredScope = (quotation.scopeOfWork || []).filter(
    (item) => !EXCLUDED_SCOPE_ITEMS.includes(item)
  );

  const showProjectOverview = 
    quotation.projectInfo.projectDescription && 
    quotation.projectInfo.projectDescription.trim() !== '' && 
    quotation.projectInfo.projectDescription.trim().toLowerCase() !== 'nothing';

  return (
    <Document title={`Quotation - ${quotation.quotationNumber}`}>
      
      {/* PAGE 1: COVER PAGE */}
      <Page size="A4" style={[styles.page, styles.coverPage]}>
        <View style={styles.coverHeader} />
        
        <View style={styles.coverMain}>
          <View style={styles.coverTopRow}>
            <Image src="/logo.jpg" style={styles.coverLogo} />
            <View style={styles.coverTitleBlock}>
              <Text style={styles.coverBadge}>Proposal & Quotation</Text>
              <Text style={styles.coverTitle}>
                {quotation.projectInfo.projectType || '' } Development
              </Text>
              <Text style={styles.coverSubtitle}>
                Custom software design & implementation proposal prepared for {quotation.clientInfo.organizationName || ''}
              </Text>
            </View>
          </View>
          
          <View style={styles.coverDivider} />
          
          <View style={styles.coverMetaBox}>
            <View style={styles.coverMetaRow}>
              <Text style={styles.coverMetaLabel}>Quotation No:</Text>
              <Text style={styles.coverMetaVal}>{quotation.quotationNumber}</Text>
            </View>
            <View style={styles.coverMetaRow}>
              <Text style={styles.coverMetaLabel}>Date of Issue:</Text>
              <Text style={styles.coverMetaVal}>{formatDate(quotation.quotationDate)}</Text>
            </View>
            <View style={styles.coverMetaRow}>
              <Text style={styles.coverMetaLabel}>Valid Till:</Text>
              <Text style={styles.coverMetaVal}>{formatDate(quotation.validTillDate)}</Text>
            </View>
            <View style={styles.coverMetaRow}>
              <Text style={styles.coverMetaLabel}>Prepared For:</Text>
              <Text style={styles.coverMetaVal}>
                {quotation.clientInfo.organizationName || ''} {quotation.clientInfo.clientType ? `(${quotation.clientInfo.clientType})` : ''}
              </Text>
            </View>
            <View style={styles.coverMetaRow}>
              <Text style={styles.coverMetaLabel}>Contact Person:</Text>
              <Text style={styles.coverMetaVal}>{quotation.clientInfo.contactPerson || ''}</Text>
            </View>
            <View style={styles.coverMetaRow}>
              <Text style={styles.coverMetaLabel}>Mobile Number:</Text>
              <Text style={styles.coverMetaVal}>{quotation.clientInfo.mobileNumber || ''}</Text>
            </View>
            <View style={styles.coverMetaRow}>
              <Text style={styles.coverMetaLabel}>Email Address:</Text>
              <Text style={styles.coverMetaVal}>{quotation.clientInfo.email || ''}</Text>
            </View>
            <View style={styles.coverMetaRow}>
              <Text style={styles.coverMetaLabel}>Billing Address:</Text>
              <Text style={styles.coverMetaVal}>{quotation.clientInfo.address || ''}</Text>
            </View>
            <View style={styles.coverMetaRow}>
              <Text style={styles.coverMetaLabel}>Prepared By:</Text>
              <Text style={styles.coverMetaVal}>{quotation.createdBy || ''}</Text>
            </View>
          </View>
          
          <View style={styles.coverFooter}>
            <View>
              <Text style={styles.coverFooterCompany}>Renvora Technologies Private Limited</Text>
              <Text style={styles.coverFooterDivision}>Transforming Ideas Into Digital Solutions</Text>
            </View>
            <View>
              <Text style={styles.coverFooterContact}>contact@shivcoretech.com</Text>
              <Text style={styles.coverFooterContact}>www.shivcoretech.com</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* PAGE 2: PROJECT OVERVIEW & SCOPE */}
      <Page size="A4" style={[styles.page, styles.contentPage]}>
        <PageHeader quotation={quotation} />
        
        <Text style={styles.sectionHeading} minPresenceAhead={80}>1. Project Definition & Architecture</Text>
        
        {/* Render Project Overview conditionally (fixes Bug 1) */}
        {showProjectOverview && (
          <View minPresenceAhead={80}>
            <Text style={styles.subHeading} minPresenceAhead={60}>Project Overview</Text>
            <Text style={styles.paragraph}>{quotation.projectInfo.projectDescription}</Text>
          </View>
        )}
        
        <Text style={styles.subHeading} minPresenceAhead={60}>Selected Scope of Work</Text>
        {filteredScope.length > 0 ? (
          renderTwoColumnList(filteredScope, '•', '#F59E0B') // Fixes Bug 5 (two column layout)
        ) : (
          <Text style={styles.paragraph}>No specific scope items selected.</Text>
        )}
        
        {/* Deliverables section removed */}

        <PageFooter />
      </Page>

      {/* PAGE 3: COMMERCIALS & FINANCIALS */}
      <Page size="A4" style={[styles.page, styles.contentPage]}>
        <PageHeader quotation={quotation} />
        
        <Text style={styles.sectionHeading} minPresenceAhead={80}>2. Commercial Proposal</Text>
        
        <Text style={styles.subHeading} minPresenceAhead={60}>Cost Estimation & Resource Breakdown</Text>
        
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableHeader}>
            <View style={styles.colDesc}>
              <Text style={{ color: '#FFFFFF' }}>Item Description</Text>
            </View>
            <View style={styles.colQty}>
              <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>Qty</Text>
            </View>
            <View style={styles.colPrice}>
              <Text style={{ color: '#FFFFFF', textAlign: 'right' }}>Price (₹)</Text>
            </View>
            <View style={styles.colTotal}>
              <Text style={{ color: '#FFFFFF', textAlign: 'right' }}>Total (₹)</Text>
            </View>
          </View>
          
          {/* Rows */}
          {quotation.commercials && quotation.commercials.map((row, idx) => (
            <View key={idx} style={idx % 2 === 0 ? styles.tableRow : styles.tableRowAlternate}>
              <View style={styles.colDesc}>
                <Text style={styles.tableText}>{row.description}</Text>
              </View>
              <View style={styles.colQty}>
                <Text style={[styles.tableText, { textAlign: 'center' }]}>{row.quantity}</Text>
              </View>
              <View style={styles.colPrice}>
                <Text style={[styles.tableText, { textAlign: 'right' }]}>{formatCurrency(row.price).replace('INR', '').trim()}</Text>
              </View>
              <View style={styles.colTotal}>
                <Text style={[styles.tableTextBold, { textAlign: 'right' }]}>{formatCurrency(row.total).replace('INR', '').trim()}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Commercial Summary Table */}
        <View style={styles.summaryWrapper}>
          <View style={styles.summaryTable}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatCurrency(quotation.subtotal)}</Text>
            </View>
            
            {quotation.gstEnabled && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>CGST & SGST (18%)</Text>
                <Text style={styles.summaryValue}>{formatCurrency(quotation.gstAmount)}</Text>
              </View>
            )}
            
            <View style={styles.summaryRowLast}>
              <Text style={styles.summaryLabelBold}>Grand Total</Text>
              <Text style={styles.summaryValueBold}>{formatCurrency(quotation.grandTotal)}</Text>
            </View>
          </View>
          <Text style={styles.wordsText}>
            {numberToWords(quotation.grandTotal)}
          </Text>
        </View>

        <Text style={styles.subHeading} minPresenceAhead={60}>3. Payment, Support & Bank Details</Text>
        
        <View style={styles.listGrid}>
          <View style={{ width: '33%', paddingRight: 10 }}>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9, color: '#0062FF', marginBottom: 4 }}>Payment Milestones:</Text>
            {quotation.paymentTerms && quotation.paymentTerms.map((term, idx) => (
              <View key={idx} style={styles.listItemFull}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>{term}</Text>
              </View>
            ))}
          </View>
          
          <View style={{ width: '33%', paddingLeft: 10, paddingRight: 10, borderLeft: 1, borderColor: '#E5E7EB' }}>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9, color: '#0062FF', marginBottom: 4 }}>Support Plan:</Text>
            {quotation.freeSupport && quotation.freeSupport.map((sup, idx) => (
              <View key={idx} style={styles.listItemFull}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>{sup}</Text>
              </View>
            ))}
          </View>

          <View style={{ width: '34%', paddingLeft: 10, borderLeft: 1, borderColor: '#E5E7EB' }}>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9, color: '#0062FF', marginBottom: 4 }}>Bank Transfer Details:</Text>
            {quotation.bankDetails ? (
              <View style={{ fontSize: 8, color: '#374151', lineHeight: 1.4 }}>
                <Text><Text style={{ fontFamily: 'Helvetica-Bold' }}>Bank: </Text>{quotation.bankDetails.bankName}</Text>
                <Text style={{ marginTop: 2 }}><Text style={{ fontFamily: 'Helvetica-Bold' }}>A/C Name: </Text>{quotation.bankDetails.accountName}</Text>
                <Text style={{ marginTop: 2 }}><Text style={{ fontFamily: 'Helvetica-Bold' }}>A/C No: </Text>{quotation.bankDetails.accountNumber}</Text>
                <Text style={{ marginTop: 2 }}><Text style={{ fontFamily: 'Helvetica-Bold' }}>IFSC: </Text>{quotation.bankDetails.ifscCode}</Text>
                <Text style={{ marginTop: 2 }}><Text style={{ fontFamily: 'Helvetica-Bold' }}>Branch: </Text>{quotation.bankDetails.branchName}</Text>
              </View>
            ) : (
              <Text style={styles.listText}>No bank details configured.</Text>
            )}
          </View>
        </View>

        <PageFooter />
      </Page>

      {/* PAGE 4: RESPONSIBILITIES, EXCLUSIONS & T&C */}
      <Page size="A4" style={[styles.page, styles.contentPage]}>
        <PageHeader quotation={quotation} />
        
        <Text style={styles.sectionHeading} minPresenceAhead={80}>3. Execution Guidelines & Framework</Text>
        
        <View style={styles.listGrid}>
          <View style={{ width: '50%', paddingRight: 10 }}>
            <Text style={styles.subHeading} minPresenceAhead={60}>Client Responsibilities</Text>
            {quotation.clientResponsibilities && quotation.clientResponsibilities.map((resp, idx) => (
              <View key={idx} style={styles.listItemFull}>
                <Text style={[styles.listBullet, { color: '#10B981' }]}>✓</Text>
                <Text style={styles.listText}>{resp}</Text>
              </View>
            ))}
          </View>
          
          <View style={{ width: '50%', paddingLeft: 10 }}>
            <Text style={styles.subHeading} minPresenceAhead={60}>Project Exclusions</Text>
            {quotation.exclusions && quotation.exclusions.map((excl, idx) => (
              <View key={idx} style={styles.listItemFull}>
                <Text style={[styles.listBullet, { color: '#EF4444' }]}>✗</Text>
                <Text style={styles.listText}>{excl}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <Text style={styles.subHeading} minPresenceAhead={60}>Website Handover Terms & Conditions</Text>
        <View style={styles.termsList}>
          {quotation.termsConditions && quotation.termsConditions.map((term, idx) => (
            <View key={idx} style={styles.termItem}>
              <Text style={styles.termIndex}>{idx + 1}.</Text>
              <Text style={styles.termText}>{term}</Text>
            </View>
          ))}
        </View>

        {/* Signature Area */}
        <View style={styles.signatureBox} wrap={false}>
          <View style={styles.sigArea}>
            <View style={styles.sigLine} />
            <Text style={styles.sigTitle}>Authorized Signatory</Text>
            <Text style={styles.sigSubtitle}>Renvora Technologies Private Limited</Text>
          </View>
          
          <View style={styles.sigArea}>
            <View style={styles.sigLine} />
            <Text style={styles.sigTitle}>Client Acceptance</Text>
            <Text style={styles.sigSubtitle}>Signature</Text>
            {quotation.clientInfo.contactPerson && (
              <Text style={{ fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: '#374151', marginTop: 6, textAlign: 'center' }}>
                For: {quotation.clientInfo.contactPerson}
              </Text>
            )}
          </View>
        </View>

        <PageFooter />
      </Page>

    </Document>
  );
};
